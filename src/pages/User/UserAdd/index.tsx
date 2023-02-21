import React from 'react';
import { Card, Btn } from 'qcloud-iot-panel-component';
import { useDeviceInfo } from '@src/hooks';
import './index.less';

export function UserAdd() {
  const sdk = window.h5PanelSdk;
  const [{ deviceData }] = useDeviceInfo();
  console.log(deviceData);
  return <div>user add</div>;
}