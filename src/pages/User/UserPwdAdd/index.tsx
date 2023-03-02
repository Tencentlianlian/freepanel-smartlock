import React, { useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { Btn } from 'qcloud-iot-panel-component';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './index.less';
import { iconMap, deviceNameMap, actionMap, actionNameMap } from '../utils';

import SuccessImg from '@src/assets/success.svg';
import FailImg from '@src/assets/failed.svg';
import { useUser } from '@src/hooks/useUser';

// 0 添加中 1 添加成功 2 添加失败
type Status = 0 | 1 | 2;

export function UserPwdAdd() {
  const [status, setStatus] = useState<Status>(0);
  const [search] = useSearchParams();
  const userid = search.get('userid');
  const type = search.get('type') as string;
  const isFromUserAdd = search.get('from') === 'useradd';
  const sdk = window.h5PanelSdk;
  const navigate = useNavigate();
  const [{ userInfo }] = useUser({ id: userid as  string });
  console.log({ userid, type });

  const cancel = async () => {
    if (status === 0) {
      await sdk.callDeviceAction({}, `cancel_add_${type}`);
    }
    navigate(-1);
  };

  useEffect(() => {
    sdk.callDeviceAction({ userid: userid }, `add_${actionNameMap[type]}`)
      .catch((err) => {
        console.error(err);
        setStatus(2);
      });
  }, []);

  useEffect(() => {
    const handler = async ({ Payload, deviceId }) => {
      console.log('receive event:', Payload, deviceId);
      if (deviceId === sdk.deviceId && Payload.eventId === `add_${actionNameMap[type]}_result`) {
        // TODO: 这里判断添加指纹是否成功
        setStatus(Payload.params.result === 1 ? 1 : 2);
      }
      // 这里等待返回结果
    };
    sdk.once('wsEventReport', handler);
    return () => {
      sdk.off('wsEventReport', handler);
    };
  }, []);

  if (status === 1) {
    return <div className="pwd-add success">
      <div className="status-info">
        <img src={SuccessImg} alt="" />
        <div className="status-title">添加成功</div>
        <div className="user-name">用户: {userInfo.name}</div>
      </div>
      <Btn type='primary'
        onClick={() => {
          if (isFromUserAdd) {
            navigate(`/user/edit/${userid}`);
            return;
          }
          cancel();
        }}
      >完成</Btn>
    </div>;
  }

  if (status === 2) {
    return <div className="pwd-add failed">
      <div className="status-info">
        <img src={FailImg} alt="" />
        <div className="status-title">添加失败</div>
        <div className="user-name">用户: {userInfo.name}</div>
      </div>
      <Btn type='primary'
        onClick={cancel}
      >重新添加</Btn>
    </div>;
  }

  return <div
    className='pwd-add'
  >
    <div className="pwd-add-title">
      <span>请在</span>
      <span>{deviceNameMap[type || '']}</span>
      <span>{actionMap[type || '']}</span>
    </div>
    <div className="pwd-add-icon">
      <img src={iconMap[type || '']} alt="" />
    </div>
    <Button className='pwd-add-exit' color='primary' fill='none'
      onClick={cancel}
    >退出流程</Button>

  </div>;
}