import { getSign } from '@src/models';
import { Input, Dialog } from 'antd-mobile';
import React, { useState, useImperativeHandle, useRef } from 'react';
import { useUnlockPwd } from '@src/hooks/useUnlockPwd';

const PwdInput = React.forwardRef((props, ref) => {
  const [pwd, setPwd] = useState('');
  useImperativeHandle(ref, () => ({
    getPwd() {
      return pwd;
    }
  }), [pwd]);

  return <div 
    style={{
      border: '0 solid #e5e5e5ff',
      height: 48,
      background: '#f3f3f5ff',
      padding: '0 10px',
      margin: 10,
      display: 'flex',
      boxSizing:'border-box'
    }}
  ><Input
      value={pwd}
      placeholder="请输入安全密码"
      onChange={(v) => setPwd(v)}
      type="password"
      maxLength={6}
      inputMode="numeric"
    />
  </div>;
});

export const useVerifyPwd = () => {
  const ref = useRef<{ getPwd: () => string }>();
  const { sp_check_code } = useUnlockPwd();
  const verifyPwd = () => {
    return new Promise((reslove, reject) => {
      Dialog.confirm({
        title: '安全密码',
        content: <PwdInput ref={ref} />,
        async onConfirm() {
          const pwd = ref.current?.getPwd();
          if (!pwd) {
            reject('未填写密码');
            return;
          }
          if (pwd.length < 6) {
            reject('请输入正确的密码');
          }
          const sign = await getSign(pwd);
          if (sign !== sp_check_code) {
            reject('密码不正确');
          }
          reslove(true);
        },
        onCancel() {
          reject('用户取消');
        }
      });
    });
  };
  return verifyPwd;
};