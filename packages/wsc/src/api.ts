import { WscParams, MountWscOptions } from './interfaces/public-types';
import { initializeWsc as _initializeWsc } from './api/initializeWsc';
import { mountWsc as _mountWsc } from './api/mountWsc';

export const initializeWsc = (wscParams: WscParams): void => {
  _initializeWsc(wscParams);
};

export const mountWsc = (options: MountWscOptions): void => {
  void _mountWsc(options);
};
