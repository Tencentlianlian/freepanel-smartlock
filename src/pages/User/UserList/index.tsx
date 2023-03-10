import React from 'react';
import { useTitle } from '@src/hooks/useTitle';
import { Card, Btn, Cell } from 'qcloud-iot-panel-component';
import { useNavigate } from 'react-router-dom';
import { useDeviceInfo } from '@src/hooks';
import { useUser, getPwdsById, authNames } from '@src/hooks/useUser';
import { nanoid } from 'nanoid';
import './index.less';

import { UserIcon } from '../components/UserIcon';

interface User{
  name: string;
  userid: string;
  effectiveTime: string;
}

export function UserList() {
  useTitle('用户列表');
  const navigate = useNavigate();
  const [{ deviceData }] = useDeviceInfo();
  const { users = [] } = deviceData;
  // const users = [];
  const [, { addUser }] = useUser({ id: 'null' });
  const renderSubtitle = (id: string) => {
    const auths = getPwdsById(id, deviceData);
    return <>
      {
        Object.keys(auths)
          .map(key => auths[key].length === 0 ? null : <span
            key={key}
            style={{ marginRight: 10 }}
          >
            {authNames[key]}{auths[key].length}个
          </span> )
      }
    </>;
  };

  const addNewUser = () => {
    const userLength = window.h5PanelSdk.deviceData.users?.length || 0;
    const user = {
      name: `用户${userLength + 1}`,
      userid: nanoid(6),
    };
    addUser(user).then(
      () => navigate(`/user/edit/${user.userid}`)
    ).catch((err) => {
      console.warn('添加失败', err);
      window.h5PanelSdk.tips.showError('添加失败');
    });
  };

  if (users.length === 0) {
    return <div className='empty user-list'>
      <div>
        <img src="https://qcloudimg.tencent-cloud.cn/raw/4beb826aa98a5520d1700ecbbdd43c6b.svg" alt=""></img>
        <div className="empty-desc">暂无用户，快去新建用户吧</div>
        <Btn type='primary'
          onClick={addNewUser}
          icon="add"
        >新建用户</Btn>
      </div>
    </div>;
  }

  return <div className='page user-list'>
    { (users as User[]).map((user, index) => {
      return (
        <Cell key={index} className="user-card"
          icon={<UserIcon />}
          title={user.name}
          subTitle={<div style={{ marginTop: 4 }}>{renderSubtitle(user.userid)}</div>}
          onClick={() => navigate(`/user/edit/${user.userid}`)}
        ></Cell>
      );
    })}
    <Btn type='primary'
      onClick={addNewUser}
      icon="add"
    >添加用户</Btn>
  </div>;
}