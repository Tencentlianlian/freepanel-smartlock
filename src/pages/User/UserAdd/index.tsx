import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cell, Card } from 'qcloud-iot-panel-component';
import { UserIcon } from '../components/UserIcon';
import { nanoid } from 'nanoid';
import './index.less';
import { actionMap, iconMap, nameMap } from '../utils';

export function UserAdd() {
  const params = useParams();
  const navigate = useNavigate();
  const user = {
    name: '新用户',
    userid: nanoid()
  };

  const addUserPwd = (type: string) => {
    navigate(`/user/password-add?userid=${user.userid}&type=${type}`);
  };

  return <div className='page user-add'>
    <Cell
      icon={<UserIcon/>}
      title={user.name}
      subTitle={'用户的权限时间'}
      style={{
        background: 'transparent',
        paddingTop: 20
      }}
      showArrow
    />
    <div className="pwd-add-area">
      <div className="desc">该用户未添加任何密码<br/>
        请选择任一类型进行添加
      </div>
      {
        Object.keys(actionMap).map((key) => (
          <Card key={key}
            className="pwd-card"
          >
            <img src={iconMap[key]} alt="" />
            <div className="name">{nameMap[key]}</div>
          </Card>
        ))
      }
      <div className="cards"></div>
    </div>
  </div>;
}