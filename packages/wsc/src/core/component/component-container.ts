import { Provider } from './provider';
import { Component } from './component';
import { Name } from './types';

/**
 * ComponentContainer that provides Providers for service name T, e.g. `wsc`, `wsc-connector-internal`
 */
export class ComponentContainer {
  private readonly providers = new Map<string, Provider<Name>>();

  constructor(public readonly name: string) {}

  /**
   * @param component Component being added
   * @description When a component with the same name has already been registered throw an exception
   */
  addComponent<T extends Name>(component: Component<T>): void {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }

    provider.setComponent(component);
  }

  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Amo SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */
  getProvider<T extends Name>(name: T): Provider<T> {
    if (this.providers.has(name)) {
      return this.providers.get(name) as unknown as Provider<T>;
    }

    // create a Provider for a service that hasn't registered with Amo
    const provider = new Provider<T>(name, this);
    this.providers.set(name, provider as unknown as Provider<Name>);

    return provider as Provider<T>;
  }
}
