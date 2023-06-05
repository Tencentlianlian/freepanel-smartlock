import { useLocalStorageState } from 'ahooks';
import { useState, useEffect } from 'react';
import { useDeviceInfo } from './useDeviceData';
const sdk = window.h5PanelSdk;

export function useDoorbellDuration() {
  const [{ deviceData, templateMap }] = useDeviceInfo();
  const [expiration, setExpiration] = useLocalStorageState(`${sdk.deviceId}-doorbell-expiration`, { defaultValue: 0 });
  const [doorbell, setDoorbell] = useState(false);

  // 从门锁呼叫强提醒消息进来且超过3分钟，跳转到h5门锁页面, 默认使用物模型的值，如果没有则使用定义中的初始值
  const notifyPeriodProp = templateMap['notify_period'];
  const notifyPeriod = deviceData['notify_period'] ||
    Number((notifyPeriodProp?.define)?.start) ||
    3;
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
          setExpiration(Date.now() + notifyPeriod * 60 * 1000);
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