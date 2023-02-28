import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Cell, Card } from 'qcloud-iot-panel-component';
import { UserIcon } from '../components/UserIcon';
import { useUser, getEffectiveTime } from '@src/hooks/useUser';
import './index.less';
import { actionMap, iconMap, nameMap } from '../utils';

export function UserAdd() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const userid = search.get('userid') as string;
  const [{ userInfo: user }] = useUser({ id: userid });

  const addUserPwd = (type: string) => {
    navigate(`/user/password-add?userid=${user.userid}&type=${type}`);
  };



  return <div className='page user-add'>
    <Cell
      icon={<UserIcon/>}
      title={user.name}
      subTitle={user.effectiveTime ? getEffectiveTime(user.effectiveTime) : '无有效时间限制'}
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
            onClick={() => addUserPwd(key)}
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