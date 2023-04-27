import { createContext } from 'react';
const sdk = window.h5PanelSdk;
const isForceOnline = sdk.productConfig?.Global?.DeviceForceOnline;
export const AppContext = createContext({
  isForceOnline,
  isSupportRemoteUnlock: false,
  isNeedPwd: false
});