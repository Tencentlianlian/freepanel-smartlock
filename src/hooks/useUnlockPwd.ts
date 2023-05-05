import { useDeviceInfo } from './useDeviceData';

export function useUnlockPwd(): {
  sp_check_code: string,
  isSupport: boolean,
  unlockNeedPwd: boolean
} {
  const [{ deviceData }] = useDeviceInfo();
  const { sp_check_code, unlock_remote_config = {} } = deviceData;
  return {
    sp_check_code,
    isSupport: unlock_remote_config?.is_support !== 0,
    unlockNeedPwd: unlock_remote_config?.switch_pwd === 1,
  };
}

