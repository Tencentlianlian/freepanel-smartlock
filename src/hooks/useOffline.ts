import { useDeviceInfo,  } from './useDeviceData';
import { useEffect } from 'react';

export function useOffline({
  showTip = true,
  checkForceOnline = false,
}) {
  const [{deviceStatus}] = useDeviceInfo();
  const offline = deviceStatus === 0;
  const sdk = window.h5PanelSdk;
  useEffect(() => {
    if (!showTip) return;
    if (offline) {
      if(checkForceOnline && sdk.productConfig?.Global?.DeviceForceOnline) {
        return;
      }
      window.h5PanelSdk.offlineTip.show();
    } else {
      window.h5PanelSdk.offlineTip.hide();
    }
  }, [offline]);
  return offline;
}