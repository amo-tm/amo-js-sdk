const V0_URL = 'https://amo-tm.github.io/wip-host/sdk.js';

export const findScript = () => {
  return document.querySelector(`script[src^="${V0_URL}"]`);
};

const injectScript = () => {
  const script = document.createElement('script');
  script.src = `${V0_URL}`;

  const headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error('Expected document.body not to be null. SDK requires a <body> element.');
  }

  headOrBody.appendChild(script);

  return script;
};

const registerWrapper = (sdk) => {
  if (!sdk || !sdk._registerWrapper) {
    return;
  }

  sdk._registerWrapper({ name: 'amo-sdk-js', version: _VERSION });
};

let sdkPromise = null;

export const loadScript = (params) => {
  // Ensure that we only attempt to load AmoSDK at most once
  if (sdkPromise !== null) {
    return sdkPromise;
  }

  sdkPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      // Resolve to null when imported server side. This makes the module
      // safe to import in an isomorphic code base.
      resolve(null);
      return;
    }

    if (window.AmoSDK && params) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }

    if (window.AmoSDK) {
      resolve(window.AmoSDK);
      return;
    }

    try {
      let script = findScript();

      if (script && params) {
        console.warn('AmoSDK already exist');
      } else if (!script) {
        script = injectScript(params);
      }

      script.addEventListener('load', () => {
        if (window.AmoSDK) {
          resolve(window.AmoSDK);
        } else {
          reject(new Error('AmoSDK is not available'));
        }
      });

      script.addEventListener('error', () => {
        reject(new Error('Failed to load AmoSDK'));
      });
    } catch (error) {
      reject(error);
      return;
    }
  });

  return sdkPromise;
};

export const initSdk = (maybeSdk, args) => {
  if (maybeSdk === null) {
    return null;
  }

  const sdk = maybeSdk(...args);
  registerWrapper(sdk);
  return sdk;
};
