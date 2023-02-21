import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDeviceInfo } from '@src/hooks';
import { Cell, Btn } from 'qcloud-iot-panel-component';
import { UserIcon } from '../components/UserIcon';
import { Popup } from 'antd-mobile';
import { FingerImg, PwdImg, CardImg, FaceImg } from '@src/assets/pwd';
import './index.less';

export function UserEdit() {
  const params = useParams();
  const [popupVisible, setPopupVisible] = useState(false);
  console.log({ params });
  const [{ deviceData }] = useDeviceInfo();
  const user = deviceData.users.find(user => user.userid === params.id);
  console.log({ user });
  return <div className='page user-edit'>
    <Cell
      icon={<UserIcon/>}
      title={user.name}
      subTitle={'用户的权限时间'}
      style={{
        background: 'transparent',
        paddingBottom: 20,
      }}
      showArrow
    />
    <Cell.Group title="指纹识别">
      <Cell
        icon={<UserIcon/>}
        title={user.name}
        subTitle={'用户的权限时间'}
        style={{
          background: 'transparent',
        }}
        showArrow
      />
    </Cell.Group>

    <Btn type="primary" icon="add"
      style={{
        marginTop: 20
      }}
      onClick={() => setPopupVisible(true)}
    >添加密码</Btn>
    <Popup
      visible={popupVisible}
      onClose={() => setPopupVisible(false)}
      onMaskClick={() => {
        setPopupVisible(false);
      }}
      bodyStyle={{ height: '25vh' }}
    >
      <div className="popup-title">
        请选择添加的密码类型
      </div>
      <div className="pwd-list">
        <div className="pwd-item">
          <div className="pwd-icon">
            <img src={FingerImg} alt="" />
          </div>
          <div className="pwd-name">指纹</div>
        </div>
        <div className="pwd-item">
          <div className="pwd-icon">
            <img src={PwdImg} alt="" />
          </div>
          <div className="pwd-name">密码</div>
        </div>
        <div className="pwd-item">
          <div className="pwd-icon">
            <img src={CardImg} alt="" />
          </div>
          <div className="pwd-name">卡片</div>
        </div>
        <div className="pwd-item">
          <div className="pwd-icon">
            <img src={FaceImg} alt="" />
          </div>
          <div className="pwd-name">人脸</div>
        </div>
      </div>
    </Popup>
  </div>;
}