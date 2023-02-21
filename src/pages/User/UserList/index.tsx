import React from 'react';
import { Card, Btn, Cell } from 'qcloud-iot-panel-component';
import { useDeviceInfo } from '@src/hooks';
import './index.less';

import UserIcon from '@src/assets/user.svg';

interface User{
  name: string;
  userid: string;
  effectiveTime: string;
}

export function UserList() {
  const sdk = window.h5PanelSdk;
  const [{ deviceData }] = useDeviceInfo();
  console.log(deviceData);
  const { users = [] } = deviceData;
  return <div className='page user-list'>
    { (users as User[]).map((user, index) => {
      return (
        <Cell key={index} className="user-card"
          icon={<img src={UserIcon} alt="" className="user-icon" />}
          title={user.name}
          subTitle={122345}
        ></Cell>
        // <Card>
        //   <img src={UserIcon} alt="" className="user-icon" />
        //   <div>
        //     <div className="card-title">{user.name}</div>
        //     <div className="card-content"></div>
        //   </div>
        // </Card>
      );
    })}
    <Btn type='primary'>添加用户</Btn>
  </div>;
}