import { useEffect, useState, useContext } from 'react';
import { Cell, Switch, Btn } from 'qcloud-iot-panel-component';
import { sdk } from '../User/utils';
import { useDeviceInfo } from '@src/hooks';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '@src/context';
import { useTitle } from '@src/hooks/useTitle';
import { Picker, Popup, Divider } from 'antd-mobile';
import './index.less';
import classNames from 'classnames';

const getDefine = (model: { define: { type: string; mapping: any; }; }) => {
  if (!model) {
    return [];
  }
  if (model.define.type !== 'enum' && model.define.type !== 'stringEnum') {
    console.log(model.define.type);
    return [];
  }
  const mapping = model.define.mapping;
  return Object.keys(mapping).map(key=> ({ value: key, label: mapping[key] }));
};

export function Setting() {
  useTitle('设置');
  const CellGroup = Cell.Group;
  const [{ deviceData, deviceInfo, templateMap }, { doControlDeviceData }] = useDeviceInfo();
  const { volume } = templateMap;
  const volumeOptions = getDefine(volume);
  const [hintVisible, setHintVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const { isForceOnline } = useContext(AppContext);
  const navigate = useNavigate();


  useEffect(() => {
    sdk.requestTokenApi('AppCheckFirmwareUpdate', {
      ProductId: sdk.productId,
      DeviceName: sdk.deviceName,
    }).then(({ CurrentVersion, DstVersion }) => {
      const isUpgradable = Boolean(DstVersion) && (DstVersion !== CurrentVersion);
      setHintVisible(isUpgradable);
    });
  }, []);


  return <div className='page setting'>
    <CellGroup>
      <Cell
        showArrow
        title="设备名称"
        footer={deviceInfo.AliasName}
        onClick={() => sdk.goEditDeviceNamePage()}
      ></Cell>
      <Cell
        showArrow
        title="设备信息"
        onClick={() => sdk.goDeviceInfoPage()}
      ></Cell>
      {!sdk.isShareDevice && <Cell
        showArrow
        title="房间设置"
        onClick={() => sdk.goRoomSettingPage()}
      ></Cell>}
      <Cell
        title="逗留侦测"
        footer={<Switch size="small"
          checked={!!deviceData.stay_alarm_mode}
          color={'#06f'}
          onChange={(e: { detail: { value: any; }; }) => {
            console.log('stay_alarm_mode', e);
            doControlDeviceData('stay_alarm_mode',  Number(e.detail.value));
          }}
        />}
      ></Cell>
      <Cell
        title="订阅通知"
        onClick={() => {
          sdk._appBridge.callMpApi('navigateTo', {
            url: `/pages/Device/ConfigWXNotify/ConfigWXNotify?deviceId=${sdk.deviceId}`,
          });
        }}
        showArrow
      ></Cell>
      {!isForceOnline && <Cell
        title="实时画面"
        footer={deviceData.rt_pic ? '始终开启' : '发生事件时开启'}
        showArrow
        onClick={() => setPopupVisible(true)}
      ></Cell>}
      {volume && <Cell
        showArrow
        title="音量"
        footer={volume.define?.mapping[deviceData.volume]}
        onClick={async() => {
          const value = await Picker.prompt({
            columns: [volumeOptions],
            defaultValue: [deviceData.volume + '']
          });
          if (value) {
            doControlDeviceData('volume', Number(value[0]));
          }
        }}
      ></Cell>}
      {!sdk.isShareDevice && <Cell
        showArrow
        title="设备分享"
        onClick={() => sdk.goShareDevicePage()}
      ></Cell>}
      {!sdk.isShareDevice && sdk.isFamilyOwner && <Cell
        showArrow
        title="安全密码"
        onClick={() => navigate('/unlock-pwd')}
      ></Cell>}
      {!sdk.isShareDevice && <Cell
        showArrow
        title="固件升级"
        footer={hintVisible ? <div className='red-dot' /> : null
        }
        onClick={() => sdk.firmwareUpgrade.showCheckUpgradeModal({ deviceId: sdk.deviceId })}
      ></Cell>}
    </CellGroup>
    <Btn type="default" className="delete-btn"
      onClick={() => sdk.deleteDevice()}
    >{ sdk.isShareDevice ? '移除分享设备' : '删除设备' }</Btn>
    {!sdk.isShareDevice && sdk.isFamilyOwner && (
      <Btn type="danger" className="delete-btn"
        onClick={() => sdk.deleteDevice({ reserveData: false })}
      >
        解绑设备并清除数据
      </Btn>
    )
    }
    <Popup
      visible={popupVisible}
      bodyClassName="videoSetting"
      closeOnMaskClick
      onClose={() => setPopupVisible(false)}
    >
      <div className="popup-title">
        实时画面设置
      </div>
      <div className="picker-item"
        onClick={() => {
          doControlDeviceData({
            rt_pic: false
          });
          setPopupVisible(false);
        }}
      >
        <div className={classNames('title', { active: !deviceData.rt_pic })}>发生事件时开启</div>
        <div>发生安全事件或门铃呼叫时，设备才触发实时画面，持续3分钟</div>
      </div>
      <Divider />
      <div className="picker-item">
        <div className={classNames('title', { active: deviceData.rt_pic })}
          onClick={() => {
            doControlDeviceData({
              rt_pic: true
            });
            setPopupVisible(false);
          }}
        >始终开启</div>
        <div>任何情况下，设备都始终开启实时画面</div>
      </div>
    </Popup>
  </div>;
}