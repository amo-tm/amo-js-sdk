let loadParams = null;
let loadSdkCalled = false;

export const loadSdk = (...args) => {
  loadSdkCalled = true;

  return loadScript(loadParams).then((maybeSdk) => initSdk(maybeSdk, args));
};

loadSdk.setLoadParameters = (params) => {
  if (loadSdkCalled) {
    throw new Error('You cannot change load parameters after calling loadSdk');
  }

  loadParams = validateLoadParams(params);
};
