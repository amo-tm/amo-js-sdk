import { WscService } from '../wsc-service';

/**
 * @public
 */
export interface WscWidgetOptions {
  /**
   * Container for initialized WSC widget.
   */
  container: string | HTMLElement;
  /**
   * Unique identifier for the app.
   */
  appId: string;
  /**
   * Unique token for the single conversation.
   */
  integrationToken: string;
}

declare module '../component/types' {
  interface NameServiceMapping {
    wsc: WscService;
  }
}
