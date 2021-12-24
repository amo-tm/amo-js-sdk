import { _getProvider } from './app/internal';
import { WscWidgetOptions } from './interfaces/public-types';

export const initializeWscWidget = (wscWidgetOptions: WscWidgetOptions): void => {
  const wsc = _getProvider('wsc').getImmediate();

  void wsc.initializeWscWidget(wscWidgetOptions);
};
