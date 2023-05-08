import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import './index.less';
import classNames from 'classnames';
import { useLocalStorageState } from 'ahooks';
import { Battery, Card, Cell, Icon, } from 'qcloud-iot-panel-component';
import { useDeviceInfo, useOffline, useDoorbellDuration } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { FloatingPanel, DatePicker, Button, ActionSheet, Toast, FloatingPanelRef, Popover } from 'antd-mobile';
import { Log } from './components/Log';
import { useLongPress } from 'ahooks';
import { PasswordModal } from './components/PasswordModal';
import isToday from 'dayjs/plugin/isToday';
import dayjs from 'dayjs';
import { useTitle } from '@src/hooks/useTitle';
import { AppContext } from '@src/context';
import { useUnlockPwd } from '@src/hooks/useUnlockPwd';
import { useVerifyPwd } from './useVerifyPwd';

import bellImg from '@src/assets/bell.gif';
import pwdImg from '../../assets/icon_password.svg';
import liveImg from '../../assets/live.svg';
import personImg from '../../assets/person.svg';


const actions = [
  { text: '全部事件', key: 'all' },
  { text: '门铃呼叫', key: 'doorbell' },
  { text: '告警信息', key: 'alarm_lock' },
];
dayjs.extend(isToday);

export function Home() {
  const sdk = window.h5PanelSdk;
  const verifyPwd = useVerifyPwd();
  const [{ deviceData }] = useDeviceInfo();
  const isUnlock = deviceData.lock_motor_state === 0;
  const navigate = useNavigate();
  const [notifyTipShow, setNotifyTipShow] = useState(false); 
  const [pickerVisible, setPickerVisible] = useState(false);
  const floatPanelRefCache = useRef<FloatingPanelRef>();
  const floatingHeightRef = useRef();
  const { isForceOnline } = useContext(AppContext);
  // actionSheet visible
  const [visible, setVisible] = useState(false);
  const [logDate, setLogDate] = useState(new Date);
  const [logType, setLogType] = useState('all');
  const [loading, setLoading] = useState(false);
  const { isSupport: isSupportRemoteUnlock, sp_check_code, unlockNeedPwd } = useUnlockPwd();
  const [minHeight, setMinheight] = useState(0.1 * window.innerHeight);
  const offline = useOffline({
    checkForceOnline: true
  });
  const disabledRef = useRef(false);
  const videoDeviceId = sdk.deviceId;
  const [pwdModalVisible, setPwdNodalVisible] = useState(false);
  const maxHeight = 0.9 * window.innerHeight;
  const showRealTimePic = !isForceOnline && deviceData.rt_pic !== 0;
  const { doorbell } = useDoorbellDuration();
  const [tipVisible, setTipVisible] = useLocalStorageState(`${sdk.deviceId}-user-tip-visible`, { defaultValue:  true });
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

  const floatPanelRef = useCallback((floatPanelRef: FloatingPanelRef) => {
    floatPanelRefCache.current = floatPanelRef;
    const userNode = document.querySelector('.card-list');
    if (userNode) {
      setTimeout(() => {
        const { top, height } =  userNode.getBoundingClientRect();
        const minHeight = window.innerHeight - top - height - 12;
        setMinheight(minHeight);
        floatPanelRef?.setHeight(minHeight);
      }, 300);
    }
    const handleBar = document.querySelector('.adm-floating-panel-bar');
    const handler = () => {
      if (floatingHeightRef.current === minHeight) {
        floatPanelRef?.setHeight(maxHeight);
      } else {
        floatPanelRef?.setHeight(minHeight);
      }
    };
    handleBar?.addEventListener('click', handler);
    return () => handleBar?.removeEventListener('click', handler);
  }, [minHeight]);

  const goVideoPanel = async () => {
    if (offline) {
      sdk.tips.showError('设备已离线');
      return;
    }
    if (!videoDeviceId) {
      console.warn('video device Id 为空');
      return;
    }
    console.warn('开始跳转', Date.now(), videoDeviceId);
    if (disabledRef.current) {
      console.warn('重复点击');
      return;
    }
    disabledRef.current = true;
    sdk.once('pageShow', () => {
      sdk.insightReportor.error('LOCK_GOTO_VIDEO_ENABLE');
      disabledRef.current = false;
    });

    // 如果发送了 wake_up 指令，就会有时间戳
    let wakeupTimestamp;
    try {
      sdk.tips.showLoading('正在跳转');
      const { wakeup_state } = await sdk.getDeviceData();
      sdk.insightReportor.info('LOCK_VIDEO_INFO', { videoDeviceId, wakeup_state: deviceData.wakeup_state, httpWakeupState: wakeup_state });

      if (wakeup_state.Value !== 1) {
        try {
          await sdk.callDeviceAction({}, 'wake_up');
        } catch (err) {
          // action有响应 和 wakeup_state 变成1 有一项OK 就能跳转
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              if (deviceData.wakeup_state === 1) {
                resolve(1);
              } else {
                reject(`唤醒设备超时:${err.code}`);
              }
            }, 1000);
          });
        }
        wakeupTimestamp = Date.now();
      }

      await sdk.goVideoPanelPage({
        deviceId: videoDeviceId,
        passThroughParams: { fullScreen: true, wakeupTimestamp },
      });
      sdk.tips.hideLoading();
    } catch (err) {
      console.warn('跳转 video 设备出错', err);
      sdk.tips.showError('设备唤醒失败，请重试');
      sdk.insightReportor.error('LOCK_GOTO_VIDEO_ERROR', { message: err });
      disabledRef.current = false;
      return;
    }
  };

  const unlock = async (e) => {
    e.preventDefault();
    console.log('unlock offline', offline);
    if (loading || offline) {
      return;
    }
    if (unlockNeedPwd) {
      try {
        await verifyPwd();
      } catch (err) {
        if (err !== '用户取消') {
          sdk.tips.showError(err);
        }
        return;
      }
    }
    setLoading(true);
    sdk.callDeviceAction({}, 'unlock_remote')
      .then((res) => {
        setLoading(false);
        Toast.show({
          icon: 'success',
          content: '开锁成功',
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log('解锁失败', err);
        sdk.tips.showError('解锁失败');
      });
  };

  const handleHeightChange = (height, animating) => {
    if (animating) return;
    floatingHeightRef.current = height;
  };

  useTitle(sdk.deviceDisplayName);

  useLongPress(unlock, document.querySelector('.unlock-btn'), { delay: 1500 });

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

  useEffect(() => {
    if (isSupportRemoteUnlock && !sp_check_code) {
      navigate('/unlock-pwd');
    }
  }, []);

  const resetFloatPanelHeight = () => {
    const userNode = document.querySelector('.card-list');
    if (userNode) {
      const { top, height } =  userNode.getBoundingClientRect();
      const minHeight = window.innerHeight - top - height - 12;
      setMinheight(minHeight);
      floatPanelRefCache.current?.setHeight(minHeight);
    }
  };

  useEffect(() => {
    resetFloatPanelHeight();
  }, [notifyTipShow, doorbell]);

  useEffect(() => {
    // 选择需要观察变动的节点
    const targetNode = document.querySelector('.card-list') as HTMLDivElement;

    // 观察器的配置（需要观察什么变动）
    const config = { childList: true, subtree: true };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(resetFloatPanelHeight);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);

    return () => observer.disconnect();
  }, []);

  return <div className={classNames('page home-page', { unlock: isUnlock })}>
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
    <div
      className={classNames('device-setting',{ bottom: notifyTipShow })}
    >
      <span onClick={() => navigate('/setting')}>
        <Icon theme="ios" icon="more" />
      </span>
      <Popover
        visible={tipVisible}
        content={
          <span style={{ fontSize: 14 }}>
            于此处进行用户管理<br/>
            <Button color='primary' fill='none' size="mini" style={{ float: 'right', paddingRight: 0 }}
              onClick={() => setTipVisible(false)}
            >
              知道了
            </Button>
          </span>
        }
        placement={'bottom-end'}
      >
        <img src={personImg} className="card-icon"
          onClick={() => navigate('/user')}
        />
      </Popover>

    </div>

    <div className={classNames('lock-state',{ 'tip-show': notifyTipShow })}>
      {isUnlock ? <img src="https://qcloudimg.tencent-cloud.cn/raw/7cdaa6cca5e56aa8f8da32d21e621cf3.png" alt="" /> 
        : <img src="https://iot.gtimg.com/cdn/ad/shuaisguo/lock+1676455008626.png" alt="" />
      }
      <div className="battery">
        <Battery value={deviceData.battery_percentage as number} showLabel/>
        <div className="splitor"></div>
        <div className='lock-label'>{isUnlock ? <span style={{ color: '#FA5151' }}>已开锁</span> : '已关锁'}</div>
      </div>
    </div>

    { doorbell && <div className="doorbell-link"
      onClick={goVideoPanel}
    >
      <div className='bell-left'>
        <img src={bellImg} />  
        画面实时中
      </div>
      <div>有人按门铃 
        <Icon icon="arrow-forward" theme="ios" color="#fff"
          size={16}
        />
      </div>
    </div>}

    <div className="card-list">
      {(!isSupportRemoteUnlock && !showRealTimePic) ?
        // 两个都不支持就占满
        <Cell
          icon={<img src={pwdImg} className="card-icon"/>}
          title="临时密码"
          className='row-cell'
          style={{ margin: 0, width: '100%' }}
          onClick={() => setPwdNodalVisible(true)}
          showArrow
        />
        : <Card
          className={classNames('card-btn', { flex: !showRealTimePic || !isSupportRemoteUnlock })}
          onClick={() => setPwdNodalVisible(true)}
        >
          <img src={pwdImg} alt="临时密码" className='card-icon' />
          <div className="card-btn-title">临时密码</div>
        </Card>
      }
      {isSupportRemoteUnlock && <Card
        className={classNames('card-btn unlock-btn', { flex: !showRealTimePic })}
        onClick={console.log}
      >
        <div className={classNames('card-icon', 'lock', { loading: loading })}>
        </div>
        <div className="card-btn-title">长按开锁</div>
      </Card>}
      {showRealTimePic ?
        <Card
          className={classNames('card-btn', { flex: !isSupportRemoteUnlock })}
          onClick={goVideoPanel}
        >
          <img src={liveImg} alt="实时画面" className='card-icon' />
          <div className="card-btn-title">实时画面</div>
        </Card>
        : null
      }
    </div>

    {/* <div>
      <Cell
        icon={<img src={personImg} className="card-icon"/>}
        title="用户管理"
        className='user-cell row-cell'
        onClick={() => navigate('/user')}
        showArrow
      ></Cell>
    </div> */}

    <FloatingPanel
      anchors={[minHeight, maxHeight]}
      handleDraggingOfContent={false}
      onHeightChange={handleHeightChange}
      ref={floatPanelRef}
    >
      <div className="log-menu">
        <div className="log-type"
          onClick={() => setVisible(true)}
        >
          {actions.find(action => action.key === logType)?.text}
          <Icon icon="arrow-down" theme="ios" color="#ccc"
            size={16}
          />
        </div>
        <div className="date-picker"
          onClick={() => setPickerVisible(true)}
        >
          {dayjs(logDate).isToday() ? '今天' : ''}({dayjs(logDate).format('YYYY-MM-DD')})
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
        <ActionSheet
          actions={actions}
          onAction={(action) => {
            setLogType(action.key as string);
            setVisible(false);
          }}
          cancelText='取消'
          visible={visible}
          onClose={() => setVisible(false)}
        />
      </div>

      <Log date={logDate} logType={logType} />
    </FloatingPanel>
    <PasswordModal
      visible={pwdModalVisible}
      onClose={() => setPwdNodalVisible(false)}
      onMaskClick={() => setPwdNodalVisible(false)}
    ></PasswordModal>
  </div>;
}