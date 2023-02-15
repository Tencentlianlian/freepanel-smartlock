import React from 'react';
import './index.less';
import classNames from 'classnames';
import {Battery, Card} from 'qcloud-iot-panel-component';
import {useDeviceInfo} from '../../hooks/useDeviceData';
import pwdImg from '../../assets/icon_password.svg';

export function Home() {
  const [{deviceData, deviceStatus}] = useDeviceInfo();
  const isUnlock = deviceData.lock_motor_state === 1;
  console.log('deviceData', deviceData);
  return <div className={classNames('page home-page', {unlock: isUnlock})}>
    <div className="lock-state">
      <img src=" https://iot.gtimg.com/cdn/ad/shuaisguo/lock+1676455008626.png" alt="" />
      <div className="battery">
        <Battery value={deviceData.battery_percentage as number} showLabel/>
        <div className="splitor"></div>
        <div className='lock-label'>{isUnlock ? '已开锁' : '已关锁'}</div>
      </div>
    </div>

    <div className="card-list">
      <Card
        className="card-btn"
      >
        <img src={pwdImg} alt="临时密码" className='card-icon' />
        <div className="card-btn-title">临时密码</div>
      </Card>
      <Card
        className="card-btn"
      >
        <img src={pwdImg} alt="点击开锁" className='card-icon' />
        <div className="card-btn-title">点击开锁</div>
      </Card>
      <Card
        className="card-btn"
      >
        <img src={pwdImg} alt="实时画面" className='card-icon' />
        <div className="card-btn-title">实时画面</div>
      </Card>
    </div>
  </div>
}