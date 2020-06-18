const V0_URL = 'https://amo.tm/sdk/v3';
const V0_URL_REGEX = /^https:\/\/amo\.tm\/sdk\/v3\/?(\?.*)?$/;
const EXISTING_SCRIPT_MESSAGE =
  'loadSdk.setLoadParameters was called but an existing Amo SDK script already exists in the document; existing script parameters will be used';

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

  sdk._registerWrapper({ name: 'sdk-js', version: _VERSION });
};

let sdkPromise = null;

export const loadScript = (params) => {
  // Ensure that we only attempt to load Amo SDK at most once
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

    if (window.Amo && params) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }

    if (window.Amo) {
      resolve(window.Amo);
      return;
    }

    try {
      let script = findScript();

      if (script && params) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      } else if (!script) {
        script = injectScript(params);
      }

      script.addEventListener('load', () => {
        if (window.Amo) {
          resolve(window.Amo);
        } else {
          reject(new Error('Amo SDK is not available'));
        }
      });

      script.addEventListener('error', () => {
        reject(new Error('Failed to load Amo SDK'));
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

export const validateLoadParams = (params) => {
  const errorMessage = `invalid load parameters.`;

  if (params === null || typeof params !== 'object') {
    throw new Error(errorMessage);
  }

  return params;
};
