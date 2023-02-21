import React from 'react';
import { Card, Btn, Cell } from 'qcloud-iot-panel-component';
import { useNavigate } from 'react-router-dom';
import { useDeviceInfo } from '@src/hooks';
import './index.less';

import { UserIcon } from '../components/UserIcon';

interface User{
  name: string;
  userid: string;
  effectiveTime: string;
}

export function UserList() {
  const navigate = useNavigate();
  const [{ deviceData }] = useDeviceInfo();
  console.log(deviceData);
  const { users = [] } = deviceData;
  return <div className='page user-list'>
    { (users as User[]).map((user, index) => {
      return (
        <Cell key={index} className="user-card"
          icon={<UserIcon />}
          title={user.name}
          subTitle={122345}
          onClick={() => navigate(`/user/edit/${user.userid}`)}
        ></Cell>
      );
    })}
    <Btn type='primary'
      onClick={() => navigate('/user/add')}
    >添加用户</Btn>
  </div>;
}