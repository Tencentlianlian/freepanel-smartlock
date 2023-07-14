import { useEffect, useState, useRef } from 'react';
import { Cell,  Btn } from 'qcloud-iot-panel-component';
import { Input } from 'antd-mobile';
import { useUnlockPwd } from '@src/hooks/useUnlockPwd';
import { useNavigate } from 'react-router-dom';
import { getSign } from '@src/models';
import './index.less';

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
  const { sp_check_code } = useUnlockPwd();
  const navigate = useNavigate();
  const submitRef = useRef(false);
  const verify = async () => {
    if (sp_check_code) {
      if (!oldPwd) {
        sdk.tips.showError('请填写旧密码');
        return false;
      }
      const sign = await getSign(oldPwd);
      if (sign !== sp_check_code) {
        sdk.tips.showError('旧密码填写错误');
        return false;
      }
    }
    if (!pwd || !pwd2) {
      sdk.tips.showError('请填写密码');
      return false;
    }
    if (pwd !== pwd2) {
      sdk.tips.showError('密码不一致，请检查');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (sp_check_code && submitRef.current) {
      navigate('/', { replace: true });
    }
  }, [sp_check_code]);
  
  const savePwd = async () => {
    const ok = await verify();
    if (!ok) {
      return;
    }
    const sign = await getSign(pwd);
    try {
      const res = await sdk.callDeviceAction({
        sp_check_code: sign,
        action_type: Action.Add
      }, 'set_safe_pwd', sdk.deviceId);
      submitRef.current = true;
      await sdk.tips.showSuccess('密码设置成功');
      setLoading(false);
    } catch (err) {
      sdk.tips.showError('密码设置失败');
      setLoading(false);
    }
  };

  const updatePwd = async() => {
    const ok = await verify();
    if (!ok) {
      return;
    }
    const sign = await getSign(pwd);
    try {
      const res = await sdk.callDeviceAction({
        sp_check_code: sign,
        action_type: Action.Add
      }, 'set_safe_pwd', sdk.deviceId);
      submitRef.current = true;
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
      {sp_check_code && <Cell
        title="旧安全密码"
        footer={
          <Input
            type="password"
            style={{ '--text-align': 'right' }}
            maxLength={6}
            placeholder="请输入6位数字旧密码"
            value={oldPwd}
            inputMode="numeric"
            onChange={(v) => setOldPwd(v)}
          />
        }
      />}
      <Cell
        title={sp_check_code ? '新安全密码' : '安全密码'}
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
        onClick={() => sp_check_code ? updatePwd() : savePwd()}
        disabled={loading}
      >
        保 存
      </Btn>
      { !sp_check_code && <Btn
        type="default"
        style={{ marginTop: '12px' }}
        onClick={() => sdk.deleteDevice()}
      >
        { sdk.isShareDevice ? '移除分享设备' : '删除设备' }
      </Btn>
      }
    </div>
  </div>;
}
