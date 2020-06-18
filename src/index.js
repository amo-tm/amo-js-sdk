import { loadScript, initSdk, loadSdk } from './shared';

// Execute our own script injection after a tick to give users time to do their
// own script injection.
const sdkPromise = Promise.resolve().then(() => loadScript(null));

let loadCalled = false;

sdkPromise.catch((err) => {
  if (!loadCalled) {
    console.warn(err);
  }
});

export const loadSdk = (...args) => {
  loadCalled = true;

  return sdkPromise.then((maybeSdk) => initSdk(maybeSdk, args));
};
