import React, {useState} from 'react';
import './index.less';
import classNames from 'classnames';
import {Battery, Card, Cell, Icon} from 'qcloud-iot-panel-component';
import {useDeviceInfo} from '../../hooks/useDeviceData';
import { useNavigate } from 'react-router-dom';
import { FloatingPanel, DatePicker } from 'antd-mobile';
import dayjs from 'dayjs';

import pwdImg from '../../assets/icon_password.svg';
import lockImg from '../../assets/unlock.svg';
import liveImg from '../../assets/live.svg';

export function Home() {
  const [{deviceData, deviceStatus}] = useDeviceInfo();
  const isUnlock = deviceData.lock_motor_state === 1;
  const navigate = useNavigate();
  const [pickerVisible, setPickerVisible] = useState(false)

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

    <FloatingPanel anchors={[0.3 * window.innerHeight, 0.6 * window.innerHeight, window.innerHeight]}>
      <div className="log-menu">
        <div className="log-type">全部事件
          <Icon icon="arrow-down" theme="ios" color="#ccc"
            size={16}
          />
        </div>
        <div className="date-picker">
          今天
          <Icon icon="arrow-down" theme="ios" color="#ccc" size={16}/>
        </div>
      </div>
    </FloatingPanel>
  </div>
}