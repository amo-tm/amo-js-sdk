import { _getProvider } from '../app/internal';
import { MountWscOptions } from '../interfaces/public-types';

export const mountWsc = async (options: MountWscOptions): Promise<void> => {
  const wsc = _getProvider('wsc').getImmediate();

  const wscParams = wsc.getCurrentWscParams();
  if (!wscParams) {
    options.onError(new Error('The Wsc should be initialized before mount.'));
    return;
  }

  let containerElement: HTMLElement | null = null;
  if (options.container instanceof HTMLElement) {
    containerElement = options.container;
  } else {
    containerElement = document.querySelector(options.container);
  }

  if (!containerElement) {
    options.onError(new Error('The container element is not found.'));
    return;
  }

  const iframeElement = await wsc.getIframeElement();
  const wscParamsAfterIframeElementGet = wsc.getCurrentWscParams();
  if (wscParamsAfterIframeElementGet !== wscParams) {
    return;
  }
  if (iframeElement instanceof Error) {
    options.onError(iframeElement);
    return;
  }

  containerElement.innerHTML = '';
  containerElement.append(iframeElement);

  const connectIframeResult = await wsc.connectIframe(wscParams);
  if (connectIframeResult instanceof Error) {
    options.onError(connectIframeResult);
    return;
  }
  options.onSuccess();
};
