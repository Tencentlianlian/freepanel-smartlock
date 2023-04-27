import './index.less';
import { useDeviceInfo } from '@src/hooks';
import { useState } from 'react';
import { Cell,  Btn } from 'qcloud-iot-panel-component';
import { Input } from 'antd-mobile';
import { useUnlockPwd } from '@src/hooks/useUnlockPwd';
import { getSign } from '@src/models';

enum Action {
  Add = 0,
  Update = 1
}

export function UnlockPwd() {
  const sdk = window.h5PanelSdk;
  const [oldPwd, setOldPwd] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlock_check_code } = useUnlockPwd();
  
  const savePwd = async () => {
    if (!pwd || !pwd2) {
      sdk.tips.showError('请填写密码');
      return;
    }
    if (pwd !== pwd2) {
      sdk.tips.showError('密码不一致，请检查');
      return;
    }
    const sign = await getSign(pwd);
    try {
      const res = await sdk.callDeviceAction({
        check_code: sign,
        action_type: Action.Add
      }, 'set_safe_pwd', sdk.deviceId);
      sdk.tips.showSuccess('密码设置成功');
      setLoading(false);
    } catch (err) {
      sdk.tips.showError('密码设置失败');
      setLoading(false);
    }
  };

  return <div className='pwd-page page'>
    <div className="title">
      <h3>请设置安全密码</h3>
      <div className="desc">用于远程开锁或查看敏感信息</div>
    </div>
    <Cell.Group>
      <Cell
        title="安全密码"
        footer={
          <Input
            type="password"
            style={{ '--text-align': 'right' }}
            maxLength={6}
            placeholder="请输入6位数字密码"
            value={pwd}
            inputMode="numeric"
            onChange={(v) => setPwd(v)}
          />
        }
      />
      <Cell
        title="确认密码"
        footer={
          <Input
            type="password"
            style={{ '--text-align': 'right' }}
            maxLength={6}
            placeholder="请再次输入密码"
            value={pwd2}
            onChange={(v) => setPwd2(v)}
            inputMode="numeric"
          />
        }
      />
    </Cell.Group>
    <div className="desc"
      style={{ marginTop: 16 }}
    >
    请谨慎保管，若忘记则无法找回，必须恢复设备出厂设置，并在小程序中删除设备后重新添加
    </div>
    <div className="btn-wrapper">
      <Btn type="primary"
        onClick={() => savePwd()}
        disabled={loading}
      >
        保 存
      </Btn>
    </div>
  </div>;
}
