import { InstantiationMode, InstanceFactory, Name } from './types';

/**
 * Component for service name T, e.g. `wsc`
 */
export class Component<T extends Name = Name> {
  instantiationMode = InstantiationMode.LAZY;

  /**
   *
   * @param name The public service name, e.g. wsc, wsc-connector-internal
   * @param instanceFactory Service factory responsible for creating the public interface
   
   */
  constructor(readonly name: T, readonly instanceFactory: InstanceFactory<T>) {}

  setInstantiationMode(mode: InstantiationMode): this {
    this.instantiationMode = mode;
    return this;
  }
}
