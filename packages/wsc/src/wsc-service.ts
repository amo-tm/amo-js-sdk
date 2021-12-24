import { Provider } from './component/provider';
import { WscWidgetOptions } from './interfaces/public-types';
import { WscConnectorInnerName } from './interfaces/wsc-connector-inner';

export class WscService {
  constructor(private readonly wscConnectorInnerProvider: Provider<WscConnectorInnerName>) {}

  async initializeWscWidget(wscWidgetOptions: WscWidgetOptions): Promise<void> {
    let containerElement: HTMLElement | null = null;
    if (wscWidgetOptions.container instanceof HTMLElement) {
      containerElement = wscWidgetOptions.container;
    } else {
      containerElement = document.querySelector(wscWidgetOptions.container);
    }

    if (!containerElement) {
      throw new Error('The container element is not found.');
    }

    const wscConnectorInner = await this.wscConnectorInnerProvider.get();

    const iframeElement = wscConnectorInner.createIframeElement();
    containerElement.append(iframeElement);

    await wscConnectorInner.initializeIframe(iframeElement, {
      appId: wscWidgetOptions.appId,
      integrationToken: wscWidgetOptions.integrationToken,
    });
  }
}
