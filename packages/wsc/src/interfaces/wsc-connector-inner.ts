interface InitializeIframeOptions {
  appId: string;
  userToken: string;
  userId: string;
  subjectId: string;
  teamId: string;
}

export interface WscConnectorInner {
  createIframeElement(): HTMLIFrameElement;

  initializeIframe(
    iframeElement: HTMLIFrameElement,
    initializeIframeOptions: InitializeIframeOptions
  ): Promise<void>;
}

export type WscConnectorInnerName = 'wsc-connector-inner';

declare module '../core/component/types' {
  interface NameServiceMapping {
    'wsc-connector-inner': WscConnectorInner;
  }
}
