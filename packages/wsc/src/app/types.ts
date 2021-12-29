import { InstanceFactory, Name } from '../core/component/types';

interface Config {
  WSC_CONNECTOR_INSTANCE_URL: string;
}

interface AmoJsSdk {
  _registerInstanceFactory: <T extends Name>(instanceFactory: InstanceFactory<T>) => void;
  _configOverwrite?: Config;
}

declare global {
  interface Window {
    AmoJsSdk: AmoJsSdk;
  }
}
