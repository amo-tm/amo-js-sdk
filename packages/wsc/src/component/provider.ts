import { Deferred } from '../helpers/deferred';

import { InstantiationMode, Name, NameServiceMapping } from './types';
import { ComponentContainer } from './component-container';
import { Component } from './component';

const DEFAULT_INSTANCE_NAME = '[DEFAULT_INSTANCE_NAME]';

/**
 * Provider for instance for service name T, e.g. 'wsc', 'wsc-connector-internal'
 * NameServiceMapping[T] is an alias for the type of the instance
 */
export class Provider<T extends Name> {
  private component: Component<T> | null = null;
  private readonly instances: Map<string, NameServiceMapping[T]> = new Map();
  private readonly instancesDeferred: Map<string, Deferred<NameServiceMapping[T]>> = new Map();

  constructor(private readonly name: T, private readonly container: ComponentContainer) {}

  get(): Promise<NameServiceMapping[T]> {
    const normalizedIdentifier = this.normalizeInstanceIdentifier();

    if (this.instances.has(normalizedIdentifier)) {
      return Promise.resolve(this.instances.get(normalizedIdentifier)!);
    }

    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        // initialize the service if it can be auto-initialized
        try {
          void this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
          });
        } catch (e) {
          // when the instance factory throws an exception during get(), it should not cause
          // a fatal error. We just return the unresolved promise in this case.
        }
      } else {
        const deferred = new Deferred<NameServiceMapping[T]>();
        this.instancesDeferred.set(normalizedIdentifier, deferred);
      }
    }

    return this.instancesDeferred.get(normalizedIdentifier)!.promise;
  }

  /**
   *
   * @param options.optional If optional is false or not provided, the method throws an error when
   * the service is not immediately available.
   * If optional is true, the method returns null if the service is not immediately available.
   */
  getImmediate(options: { optional: true }): NameServiceMapping[T] | null;
  getImmediate(options?: { optional?: false }): NameServiceMapping[T];
  getImmediate(options?: { optional?: boolean }): NameServiceMapping[T] | null {
    const normalizedIdentifier = this.normalizeInstanceIdentifier();
    const optional = options?.optional ?? false;

    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        const instanceOrInstancePromise = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier,
        })!;
        if (instanceOrInstancePromise instanceof Promise) {
          if (optional) {
            return null;
          } else {
            throw Error(`Service ${this.name} is not ready.`);
          }
        }
        return instanceOrInstancePromise;
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      // In case a component is not initialized and should/can not be auto-initialized at the moment, return null if the optional flag is set, or throw
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available.`);
      }
    }
  }

  setComponent(component: Component<T>): void {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }

    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }

    this.component = component;

    // return early without attempting to initialize the component
    if (!this.shouldAutoInitialize()) {
      return;
    }

    // if the service is eager, initialize the default instance
    if (isComponentEager(component)) {
      try {
        void this.getOrInitializeService({ instanceIdentifier: DEFAULT_INSTANCE_NAME });
      } catch (e) {
        // when the instance factory for an eager Component throws an exception during the eager
        // initialization, it should not cause a fatal error.
      }
    }
  }

  isComponentSet(): boolean {
    return this.component !== null;
  }

  isInitialized(identifier: string = DEFAULT_INSTANCE_NAME): boolean {
    return this.instances.has(identifier);
  }

  private getOrInitializeService({
    instanceIdentifier,
    options = {},
  }: {
    instanceIdentifier: string;
    options?: Record<string, unknown>;
  }): NameServiceMapping[T] | Promise<NameServiceMapping[T]> | null {
    let instance = this.instances.get(instanceIdentifier);
    let instanceDeferred = this.instancesDeferred.get(instanceIdentifier);

    if (this.component && !(instance || instanceDeferred)) {
      const instanceOrInstancePromise = this.component.instanceFactory(this.container, {
        options,
      });
      if (instanceOrInstancePromise instanceof Promise) {
        instanceDeferred = instanceDeferred || new Deferred<NameServiceMapping[T]>();
        this.instancesDeferred.set(instanceIdentifier, instanceDeferred);
        instanceOrInstancePromise.then((instance) => {
          const currentInstanceDeferred = this.instancesDeferred.get(instanceIdentifier);
          if (!currentInstanceDeferred || currentInstanceDeferred !== instanceDeferred) {
            return;
          }
          this.instances.set(instanceIdentifier, instance);
          this.instancesDeferred.delete(instanceIdentifier);
          currentInstanceDeferred.resolve(instance);
        }, instanceDeferred.reject);
      } else {
        instance = instanceOrInstancePromise;
        this.instances.set(instanceIdentifier, instance);
      }
    }

    return instance || instanceDeferred?.promise || null;
  }

  private normalizeInstanceIdentifier(): string {
    return DEFAULT_INSTANCE_NAME;
  }

  private shouldAutoInitialize(): boolean {
    return Boolean(this.component);
  }
}

function isComponentEager<T extends Name>(component: Component<T>): boolean {
  return component.instantiationMode === InstantiationMode.EAGER;
}
