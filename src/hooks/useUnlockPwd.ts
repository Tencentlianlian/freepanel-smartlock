import { useDeviceInfo } from './useDeviceData';

export function useUnlockPwd(): {
  unlock_check_code: string,
  isSupport: boolean,
  unlockNeedPwd: boolean
} {
  const [{ deviceData }] = useDeviceInfo();
  const { unlock_check_code, unlock_remote_config = {} } = deviceData;
  return {
    unlock_check_code,
    isSupport: unlock_remote_config?.is_support === 1,
    unlockNeedPwd: unlock_remote_config?.is_support === 1,
  };
}

