import { Provider } from './core/component/provider';
import { Deferred } from './core/deferred';
import { WscParams } from './interfaces/public-types';
import { WscConnectorInnerName } from './interfaces/wsc-connector-inner';

export class WscService {
  private currentWscParams: WscParams | null = null;
  private iframeElementDeffered: Deferred<HTMLIFrameElement> | null = null;
  private connectingPromise: Promise<void | Error> | null = null;

  constructor(private readonly wscConnectorInnerProvider: Provider<WscConnectorInnerName>) {}

  updateParams(wscParams: WscParams): void {
    // Preload wscConnectorInner
    void this.wscConnectorInnerProvider.get();

    this.currentWscParams = wscParams;
    this.connectingPromise = null;
    this.iframeElementDeffered = null;
  }

  getCurrentWscParams(): WscParams | null {
    return this.currentWscParams;
  }

  async connectIframe(wscParams: WscParams): Promise<void | Error> {
    if (!this.connectingPromise) {
      const connectingPromise = new Promise<void | Error>(async (resolve) => {
        const [iframeElement, wscConnectorInner] = await Promise.all([
          this.getIframeElement(),
          this.wscConnectorInnerProvider.get(),
        ]);
        if (connectingPromise !== this.connectingPromise) {
          return;
        }
        if (iframeElement instanceof Error) {
          resolve(iframeElement);
          return;
        }
        if (wscParams !== this.currentWscParams) {
          resolve(new Error('The Wsc was reinitialized with other params.'));
          return;
        }
        await wscConnectorInner.initializeIframe(iframeElement, wscParams);
        if (connectingPromise !== this.connectingPromise) {
          return;
        }
        resolve();
      });
      this.connectingPromise = connectingPromise;
    }

    return this.connectingPromise;
  }

  async getIframeElement(): Promise<HTMLIFrameElement | Error> {
    if (!this.currentWscParams) {
      return new Error('The Wsc should be initialized before.');
    }
    if (!this.iframeElementDeffered) {
      const deffered = new Deferred<HTMLIFrameElement>();
      this.iframeElementDeffered = deffered;
      void this.wscConnectorInnerProvider
        .get()
        .then((wscConnectorInner) => {
          return wscConnectorInner.createIframeElement();
        })
        .then((iframeElement) => {
          if (deffered === this.iframeElementDeffered) {
            deffered.resolve(iframeElement);
          }
        });
    }
    return this.iframeElementDeffered!.promise;
  }
}
