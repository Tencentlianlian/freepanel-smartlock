import { useDeviceInfo,  } from './useDeviceData';
import { useEffect } from 'react';

export function useOffline(showTip = true) {
  const [{deviceStatus}] = useDeviceInfo();
  const offline = deviceStatus === 0;

  useEffect(() => {
    if (!showTip) return;
    if (offline) {
      window.h5PanelSdk.offlineTip.show();
    } else {
      window.h5PanelSdk.offlineTip.hide();
    }
  }, [offline]);
  return offline;
}