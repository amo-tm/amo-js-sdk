import { Deferred } from '../deferred';
import { InstanceFactory, Name, RemoteInstanceUrl } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const instanceFactoriesDeferred = new Map<RemoteInstanceUrl, Deferred<InstanceFactory<any>>>();

export const _registerRemoteInstanceFactory = <T extends Name>(
  instanceFactory: InstanceFactory<T>
): void => {
  const currentScript = document.currentScript;
  if (!currentScript || !(currentScript instanceof HTMLScriptElement)) {
    return;
  }
  const remoteInstanceUrl: RemoteInstanceUrl = currentScript.src;
  const instanceFactoryDeferred = instanceFactoriesDeferred.get(remoteInstanceUrl);
  if (!instanceFactoryDeferred) {
    return;
  }
  instanceFactoryDeferred.resolve(instanceFactory);
};

export class RemoteInstanceLoader<T extends Name> {
  constructor(private readonly url: RemoteInstanceUrl) {}

  getInstanceFactory(): InstanceFactory<T> {
    return (container, options) => {
      let instanceFactoryDeferred: Deferred<InstanceFactory<T>> | undefined =
        instanceFactoriesDeferred.get(this.url);

      if (!instanceFactoryDeferred) {
        instanceFactoryDeferred = new Deferred<InstanceFactory<T>>();
        instanceFactoriesDeferred.set(this.url, instanceFactoryDeferred);
        this.initializeRemoteScript(this.url);
      }

      return instanceFactoryDeferred.promise.then((instanceFactory) => {
        return instanceFactory(container, options);
      });
    };
  }

  private initializeRemoteScript(url: string): void {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.src = url;

    const anchorElement = document.getElementsByTagName('script')[0];
    anchorElement.parentNode!.insertBefore(scriptElement, anchorElement);
  }
}
