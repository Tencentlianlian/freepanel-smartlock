import { useEffect, useState } from 'react';
import { Cell, Switch, Btn } from 'qcloud-iot-panel-component';
import { useDeviceInfo } from '@src/hooks';
import { useTitle } from '@src/hooks/useTitle';
import { Picker } from 'antd-mobile';
import './index.less';

const getDefine = (model) => {
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
  const sdk = window.h5PanelSdk;
  const [{ deviceData, deviceInfo, templateMap }, { doControlDeviceData }] = useDeviceInfo();
  const { volume } = templateMap;
  const volumeOptions = getDefine(volume);
  const [hintVisible, setHintVisible] = useState(false);

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
      <Cell
        showArrow
        title="房间设置"
        onClick={() => sdk.goRoomSettingPage()}
      ></Cell>
      <Cell
        title="逗留侦测"
        footer={<Switch size="small"
          checked={!!deviceData.stay_alarm_mode}
          color={'#06f'}
          onChange={(e) => {
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
      <Cell
        showArrow
        title="音量"
        footer={volume.define.mapping[deviceData.volume]}
        onClick={async() => {
          const value = await Picker.prompt({
            columns: [volumeOptions],
            defaultValue: [deviceData.volume + '']
          });
          console.log('select:', value);
          if (value) {
            doControlDeviceData('volume', Number(value[0]));
          }
        }}
      ></Cell>
      <Cell
        showArrow
        title="设备分享"
        onClick={() => sdk.goShareDevicePage()}
      ></Cell>
      <Cell
        showArrow
        title="固件升级"
        footer={hintVisible ? <div className='red-dot' /> : null
        }
        onClick={() => sdk.checkFirmwareUpgrade()}
      ></Cell>
    </CellGroup>
    <Btn type="default" className="delete-btn"
      onClick={() => sdk.deleteDevice()}
    >{ sdk.isShareDevice ? '移除分享设备' : '删除设备' }</Btn>
    {/* <Btn type="default" className="delete-btn">解绑设备并清除数据</Btn> */}
  </div>;
}