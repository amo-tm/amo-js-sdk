import { Name } from '../component/types';
import { Component } from '../component/component';
import { Provider } from '../component/provider';

import { ComponentContainer } from '../component/component-container';
import { Logger } from '../logger/logger';

/**
 * The default container name
 *
 * @internal
 */
const DEFAULT_CONTAINER_NAME = '[DEFAULT_CONTAINER_NAME]';

const container = new ComponentContainer(DEFAULT_CONTAINER_NAME);
const logger = new Logger('app');

/**
 * Registered components.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _components = new Map<string, Component<any>>();

/**
 * @param component - the component being added to the default container
 * @internal
 */
export function _addComponent<T extends Name>(component: Component<T>): void {
  try {
    container.addComponent(component);
  } catch (e) {
    logger.debug(
      `Component ${component.name} failed to register with ComponentContainer ${container.name}`,
      e
    );
  }
}

/**
 *
 * @param component - the component to register
 * @returns whether or not the component is registered successfully
 *
 * @internal
 */
export function _registerComponent<T extends Name>(component: Component<T>): boolean {
  const componentName = component.name;
  if (_components.has(componentName)) {
    logger.debug(`There were multiple attempts to register component ${componentName}.`);

    return false;
  }

  _components.set(componentName, component);

  // add the component to existing container instances
  _addComponent(component);

  return true;
}

/**
 * @param name - service name
 *
 * @returns the provider for the service with the matching name
 *
 * @internal
 */
export function _getProvider<T extends Name>(name: T): Provider<T> {
  return container.getProvider(name);
}
