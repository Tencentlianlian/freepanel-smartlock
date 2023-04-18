import { Popup, PopupProps } from 'antd-mobile';
import { sdk } from '@src/pages/User/utils';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { copyText } from '@src/utils/copy';
import './index.less';

interface PasswordModalProps extends PopupProps {
  position?: 'bottom'
}

const getDeviceOTP = async () => {
  const res = await sdk.requestTokenApi('AppGenerateDeviceOTP', {
    DeviceId: sdk.deviceId,
    Digit: 6,
  });
  const {
    OTPPasswordProperty: {
      Expired: expired,
      OTPPassword: password,
    },
  } = res;
  return { expired, password };
};

export function PasswordModal(props: PasswordModalProps) {
  const { visible } = props;
  const [singlePassword, setSinglePassword] = useState({ password: '', expired: '' });

  const generatePwd = () => getDeviceOTP().then((res) => {
    setSinglePassword({
      password: res.password,
      expired: dayjs(1000 * (res.expired + 20 * 60) /* 有效期 20分钟 */).format('YYYY/MM/DD HH:mm'),
    });
  })
    .catch((err) => {
      console.log(err);
      sdk.tips.showError(err.msg);
    });

  useEffect(() => {
    if (visible) {
      generatePwd();
    }
  }, [visible]);

  return <Popup
    {...props}
    className="pwd-modal"
  >
    <div className="pwd-modal-title">临时密码</div>
    <div className="pwd-modal-area"
      onClick={generatePwd}
    >{
        singlePassword.password.split('').map((num, idx) => <span key={idx}>{num}</span> )
      }
    </div>
    <div className="pwd-modal-ft">
      <span style={{ color: '#A1A7B2' }}>20分钟内有效</span>
      <a role="button" onClick={() => {
        copyText(singlePassword.password);
        sdk.tips.showSuccess('复制成功');
      }}>复制密码</a>
    </div>
  </Popup>; 
}