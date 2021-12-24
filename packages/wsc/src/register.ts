import { _registerComponent } from './app/internal';
import { Component } from './component/component';
import { InstanceFactory } from './component/types';
import { RemoteInstanceLoader } from './component/remote-instance-loader';
import { WscService } from './wsc-service';
import { WscConnectorInnerName } from './interfaces/wsc-connector-inner';

const WscFactory: InstanceFactory<'wsc'> = (container) => {
  return new WscService(container.getProvider('wsc-connector-inner'));
};

export function registerWsc(): void {
  _registerComponent(
    new Component(
      'wsc-connector-inner',
      new RemoteInstanceLoader<WscConnectorInnerName>(
        'https://js.amo.tm/v1.3/wsc/connector.js'
      ).getInstanceFactory()
    )
  );

  _registerComponent(new Component('wsc', WscFactory));
}
