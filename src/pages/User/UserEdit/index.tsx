import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeviceInfo } from '@src/hooks';
import { Cell, Btn, Card } from 'qcloud-iot-panel-component';
import { UserIcon } from '../components/UserIcon';
import { Popup } from 'antd-mobile';
import { FingerImg, PwdImg, CardImg, FaceImg } from '@src/assets/pwd';
import DeleteImg from '@src/assets/delete.svg';
import './index.less';
import { useUser, getEffectiveTime } from '@src/hooks/useUser';
import { actionMap, iconMap, nameMap } from '../utils';

export function UserEdit() {
  const params = useParams();
  const sdk = window.h5PanelSdk;
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [{ deviceData }] = useDeviceInfo();
  const [{ userInfo }, { deleteUser }] = useUser({ id: params.id as string });
  const hasNoPwd = [userInfo.faces, userInfo.cards, userInfo.fingerprints, userInfo.passwords].every(auth => auth.length === 0);
  const addUserPwd = (type: string) => {
    navigate(`/user/password-add?userid=${userInfo.userid}&type=${type}`);
  };

  const removeAuth = async (id, type: 'face' | 'password' | 'card' | 'fingerprint') => {
    const isDelete = await sdk.tips.confirm('确认删除?');
    if (!isDelete) return;

    try {
      const res = await sdk.callDeviceAction({ id }, `delete_${type}`);
      if (JSON.parse(res.OutputParams || '{}').result !== 1) {
        throw new Error('删除失败, 请重试');
      } else {
        sdk.tips.showSuccess('删除成功');
      }
    } catch (err) {
      console.warn(err);
      sdk.tips.showError('删除失败');
    }
  };


  const deleteIcon= <img src={DeleteImg} className="delete-icon"/>;

  const removeUser = async() => {
    const isConfirm = await window.h5PanelSdk.tips.confirm('删除用户', '删除用户后，该用户的信息和密码也将被删除', {
      confirmColor: '#FA5151'
    });
    if (isConfirm) {
      deleteUser(userInfo.userid).then(() => {
        window.h5PanelSdk.tips.showSuccess('删除成功');
        navigate(-1);
      }).catch(err => {
        window.h5PanelSdk.tips.showError('删除失败');
        console.warn(err);
      });
    }
  };

  return <div className='page user-edit'>
    <Cell
      icon={<UserIcon/>}
      title={userInfo.name}
      subTitle={<span
        style={{ marginTop: 4, display: 'block' }}
      >
        {userInfo.effectiveTime ? getEffectiveTime(userInfo.effectiveTime) : '无有效时间限制'}
      </span>}
      style={{
        background: 'transparent',
        paddingBottom: 20,
      }}
      onClick={() => navigate(`/user/info/${userInfo.userid}`)}
      showArrow
    />

    {  hasNoPwd && <div className="pwd-add-area">
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
    </div>}

    {userInfo.fingerprints.length > 0 && <Cell.Group title="指纹识别" className='pwd-group'>
      {
        userInfo.fingerprints.map(({ id: key }, index) => {
          return <Cell
            key={index}
            title={`指纹${index + 1}`}
            onClick={() => removeAuth(key, 'fingerprint')}
            footer={deleteIcon}
          />;
        })
      }
    </Cell.Group>}
    {userInfo.passwords.length > 0 && <Cell.Group title="数字密码" className='pwd-group'>
      {
        userInfo.passwords.map(({ id: key }, index) => {
          return <Cell
            key={index}
            title={`密码${index + 1}`}
            onClick={() => removeAuth(key, 'password')}
            footer={deleteIcon}
          />;
        })
      }
    </Cell.Group>}
    {userInfo.faces.length > 0 && <Cell.Group title="面部识别" className='pwd-group'>
      {
        userInfo.faces.map(({ id: key }, index) => {
          return <Cell
            key={index}
            title={`面容ID${index + 1}`}
            onClick={() => removeAuth(key, 'face')}
            footer={deleteIcon}
          />;
        })
      }
    </Cell.Group>}

    {userInfo.cards.length > 0 && <Cell.Group title="卡片" className='pwd-group'>
      {
        userInfo.cards.map(({ id: key }, index) => {
          return <Cell
            key={index}
            title={`卡片${index + 1}`}
            onClick={() => removeAuth(key, 'card')}
            footer={deleteIcon}
          />;
        })
      }
    </Cell.Group>}
    {!hasNoPwd &&  <>
      <Btn type="default"
        style={{
          marginTop: 20
        }}
        onClick={removeUser}
      >删除用户</Btn>
      <Btn type="primary" icon="add"
        style={{
          marginTop: 20
        }}
        onClick={() => setPopupVisible(true)}
      >添加密码</Btn>
    </>}
    {hasNoPwd && <a role={'button'} onClick={removeUser} className="remove-link">删除用户</a>}
    <Popup
      visible={popupVisible}
      onClose={() => setPopupVisible(false)}
      onMaskClick={() => {
        setPopupVisible(false);
      }}
    >
      <div className="popup-title">
        请选择添加的密码类型
      </div>
      <div className="pwd-list">
        <div className="pwd-item" onClick={() => addUserPwd('finger')}>
          <div className="pwd-icon">
            <img src={FingerImg} alt="" />
          </div>
          <div className="pwd-name">指纹</div>
        </div>
        <div className="pwd-item" onClick={() => addUserPwd('pwd')}>
          <div className="pwd-icon">
            <img src={PwdImg} alt="" />
          </div>
          <div className="pwd-name">数字密码</div>
        </div>
        <div className="pwd-item" onClick={() => addUserPwd('card')}>
          <div className="pwd-icon">
            <img src={CardImg} alt="" />
          </div>
          <div className="pwd-name">卡片</div>
        </div>
        <div className="pwd-item" onClick={() => addUserPwd('face')}>
          <div className="pwd-icon">
            <img src={FaceImg} alt="" />
          </div>
          <div className="pwd-name">面部</div>
        </div>
      </div>
    </Popup>
  </div>;
}