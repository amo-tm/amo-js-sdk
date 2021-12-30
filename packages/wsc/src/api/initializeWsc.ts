import { _getProvider } from '../app/internal';
import { WscParams } from '../interfaces/public-types';

export const initializeWsc = (wscParams: WscParams): void => {
  const wsc = _getProvider('wsc').getImmediate();
  wsc.updateParams(wscParams);
};
