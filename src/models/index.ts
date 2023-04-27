const sdk = window.h5PanelSdk;

export const getSign = async (payload: string) => {
  const res = await sdk.requestTokenApi('AppDeviceCustomSignature', {
    DeviceId: sdk.deviceId,
    Content: payload,
    SignMethod: 'hmacsha1',
  });
  return res.Signature;
};