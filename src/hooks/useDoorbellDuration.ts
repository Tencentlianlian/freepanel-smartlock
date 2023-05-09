import { useLocalStorageState } from 'ahooks';
import { useState, useEffect } from 'react';
const sdk = window.h5PanelSdk;

export function useDoorbellDuration() {
  const [expiration, setExpiration] = useLocalStorageState(`${sdk.deviceId}-doorbell-expiration`, { defaultValue: 0 });
  const [doorbell, setDoorbell] = useState(false);
  const doorbellValid = Date.now() < expiration;
  useEffect(() => {
    if (doorbellValid) {
      setDoorbell(true);
    }
    const handler = ({ Payload, deviceId }) => {
      if (deviceId === sdk.deviceId) {
        console.log('wsEventReport', Payload);
        if (Payload.eventId === 'doorbell') {
          setDoorbell(true);
          setExpiration(Date.now() + 3 * 60 * 1000);
        }
      }
    };
    sdk.on('wsEventReport', handler);
    return () => {
      sdk.off('wsEventReport', handler);
    };
  }, []);
  return {
    doorbell,
    expiration,
    setExpiration,
  };
}