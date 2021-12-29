import { ComponentContainer } from './component-container';

export const enum InstantiationMode {
  LAZY = 'LAZY', // Currently most components are LAZY in JS SDK
  EAGER = 'EAGER', // EAGER components are initialized immediately upon registration
}

export interface InstanceFactoryOptions {
  options?: {};
}

/**
 * Factory to create an instance of type T, given a ComponentContainer.
 * ComponentContainer is the IOC container that provides {@link Provider}
 * for dependencies.
 *
 * NOTE: The container only provides {@link Provider} rather than the actual instances of dependencies.
 * It is useful for lazily loaded dependencies and optional dependencies.
 */
export type InstanceFactory<T extends Name> = (
  container: ComponentContainer,
  options: InstanceFactoryOptions
) => NameServiceMapping[T] | Promise<NameServiceMapping[T]>;

/**
 * This interface will be extended by Amo SDKs to provide service name and service type mapping.
 * It is used as a generic constraint to ensure type safety.
 */
export interface NameServiceMapping {}

export type Name = keyof NameServiceMapping;
export type Service = NameServiceMapping[Name];

export type RemoteInstanceUrl = string;
