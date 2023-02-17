import React, { useState, useCallback, useEffect } from 'react';
import './index.less';
import classNames from 'classnames';
import {Battery, Card, Cell, Icon, } from 'qcloud-iot-panel-component';
import {useDeviceInfo, useOffline } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { FloatingPanel, DatePicker, Button, Dropdown } from 'antd-mobile';
import dayjs from 'dayjs';

import pwdImg from '../../assets/icon_password.svg';
import lockImg from '../../assets/unlock.svg';
import liveImg from '../../assets/live.svg';

export function Home() {
  const sdk = window.h5PanelSdk;
  const [{deviceData}] = useDeviceInfo();
  const isUnlock = deviceData.lock_motor_state === 1;
  const navigate = useNavigate();
  const [notifyTipShow, setNotifyTipShow] = useState(false); 
  const [pickerVisible, setPickerVisible] = useState(false);
  const [logDate, setLogDate] = useState(new Date);
  const offline = useOffline();

  const labelRenderer = useCallback((type: string, data: number) => {
    switch (type) {
      case 'year':
        return data + '年';
      case 'month':
        return data + '月';
      case 'day':
        return data + '日';
      default:
        return data;
    }
  }, []);

  useEffect(() => {
    if (sdk.deviceStatus === 0) {
      return;
    }
    sdk.requestTokenApi('AppIsWechatSubscribeable', {
      DeviceName: sdk.deviceName,
      ProductId: sdk.productId,
    }).then(({ AppWechatSubscribeableProperty: describeInfo }) => {
      console.log({ describeInfo });
      // 当前产品可以订阅消息
      if (describeInfo.IsSubscribeable) {
        const bellSubscribeInfo = describeInfo.Templates.find((tpl) => tpl.Title === '门铃呼叫提醒');
        if (bellSubscribeInfo && bellSubscribeInfo.Status === 0) {
          setNotifyTipShow(true);
        }
      }
    });
  }, []);

  return <div className={classNames('page home-page', {unlock: isUnlock})}>
    {notifyTipShow && <div className="notify-tip"
      color='primary'
    >
      <span>为避免错过重要事件，请开启消息提醒</span>
      <Button
        size='mini'
        shape='rounded'
        style={{
          color: '#fff',
          marginLeft: 10,
          backgroundImage: 'linear-gradient(135deg,#3d8bff,#06f)'
        }}
        onClick={() => {
          sdk._appBridge.callMpApi('navigateTo', {
            url: `/pages/Device/ConfigWXNotify/ConfigWXNotify?deviceId=${sdk.deviceId}`,
          });
        }}
      >去开启</Button>
    </div>}
    <div className="lock-state">
      <img src=" https://iot.gtimg.com/cdn/ad/shuaisguo/lock+1676455008626.png" alt="" />
      <div className="battery">
        <Battery value={deviceData.battery_percentage as number} showLabel/>
        <div className="splitor"></div>
        <div className='lock-label'>{isUnlock ? <span style={{color: '#FA5151'}}>已开锁</span> : '已关锁'}</div>
      </div>
    </div>

    <div className="card-list">
      <Card
        className="card-btn"
        onClick={() => navigate('/password')}
      >
        <img src={pwdImg} alt="临时密码" className='card-icon' />
        <div className="card-btn-title">临时密码</div>
      </Card>
      <Card
        className="card-btn"
      >
        <img src={lockImg} alt="点击开锁" className='card-icon' />
        <div className="card-btn-title">点击开锁</div>
      </Card>
      <Card
        className="card-btn"
      >
        <img src={liveImg} alt="实时画面" className='card-icon' />
        <div className="card-btn-title">实时画面</div>
      </Card>
    </div>

    <Cell
      icon="person"
      title="用户管理"
      className='user-cell'
      onClick={() => navigate('/password')}
      showArrow
    ></Cell>

    <FloatingPanel anchors={[0.3 * window.innerHeight, 0.6 * window.innerHeight, 0.9 * window.innerHeight]}>
      <div className="log-menu">
        <div className="log-type">全部事件
          <Icon icon="arrow-down" theme="ios" color="#ccc"
            size={16}
          />
        </div>
        <div className="date-picker"
          onClick={() => setPickerVisible(true)}
        >
          今天({dayjs(logDate).format('YYYY-MM-DD')})
          <Icon icon="arrow-down" theme="ios" color="#ccc" size={16}/>
        </div>
        <DatePicker
          title='时间选择'
          visible={pickerVisible}
          onClose={() => {
            setPickerVisible(false);
          }}
          renderLabel={labelRenderer}
          max={new Date}
          onConfirm={val => {
            console.log(val);
            setLogDate(val);
          }}
        />
      </div>
    </FloatingPanel>
  </div>;
}