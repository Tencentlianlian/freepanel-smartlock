import React from 'react';
import { Button } from 'antd-mobile';
import { useSearchParams } from 'react-router-dom';
import './index.less';
import { iconMap, deviceNameMap, actionMap } from '../utils';

export function UserPwdAdd() {
  const [search] = useSearchParams();
  const userid = search.get('userid');
  const type = search.get('type');
  console.log({userid, type})
  return <div
    className='pwd-add'
  >
    <div className="pwd-add-title">
      <span>请在</span>
      <span>{deviceNameMap[type || '']}</span>
      <span>{actionMap[type || '']}</span>
    </div>
    <div className="pwd-add-icon">
      <img src={iconMap[type || '']} alt="" />
    </div>
    <Button className='pwd-add-exit' color='primary' fill='none'>退出流程</Button>

  </div>;
}