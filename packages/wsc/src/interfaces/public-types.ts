import { WscService } from '../wsc-service';

/**
 * @public
 */
export interface WscParams {
  /**
   * Unique identifier for the app.
   */
  appId: string;
  /**
   * Unique token for the current user.
   */
  userToken: string;
  /**
   * Unique identifier for the current user.
   */
  userId: string;
  /**
   * Unique identifier for the subject you want to open.
   */
  subjectId: string;
  /**
   * Unique identifier for the subject team.
   */
  teamId: string;
}

/**
 * @public
 */
export interface MountWscOptions {
  /**
   * The CSS selector or DOM element where the WSC will be mounted.
   */
  container: string | HTMLElement;
  /**
   * The callback that's called when mount is failed.
   */
  onError?: (error: Error) => void;
  /**
   * The callback that's called when mount is succeeded.
   */
  onSuccess?: () => void;
}

declare module '../core/component/types' {
  interface NameServiceMapping {
    wsc: WscService;
  }
}
