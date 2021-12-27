export interface AmoJsSdk {}

export type AmoJsSdkMethodName = keyof AmoJsSdk;
export type AmoJsSdkMethod = AmoJsSdk[AmoJsSdkMethodName];

declare global {
  interface Window {
    AmoJsSdk: AmoJsSdk;
  }
}

window.AmoJsSdk = {};

export const _setAmoJsSdkMethod = (
  methodName: AmoJsSdkMethodName,
  method: AmoJsSdkMethod
): void => {
  window.AmoJsSdk[methodName] = method;
};
