import { Cell } from 'qcloud-iot-panel-component';
import { useParams } from 'react-router-dom';
import { useUser } from '@src/hooks/useUser';
import { Picker, DatePicker } from 'antd-mobile';
import { useState } from 'react';

import './index.less';

export function UserSetting() {
  const { id } = useParams();
  const [{ userInfo }] = useUser({ id: id as string });
  const { effectiveTime } = userInfo;
  const [eTime, setETime] = useState(effectiveTime);
  const [beginVisible, setBeginVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);

  const types = ['永久有效', '周期有效'];
  return <div className='page user-setting'>
    用户信息设置
    <Cell
      title="用户名称"
      showArrow
      footer={
        userInfo.name
      }
    />
    <Cell.Group style={{ marginTop: 12 }}>
      <Cell
        title="权限类型"
        footer={types[eTime.type || 0]}
        onClick={() => setTypeVisible(true)}
        showArrow
      ></Cell>
      <>
        <Cell
          title="开始日期"
          footer={eTime.beginDate || Date.now()}
          onClick={() => setBeginVisible(true)}
          showArrow
        ></Cell>
        <Cell
          title="结束日期"
          footer={eTime.endDate || Date.now()}
          onClick={() => setEndVisible(true)}
          showArrow
        ></Cell>
        <Cell
          title="有效时间段"
          footer={types[eTime.endDate || Date.now()]}
          showArrow
        ></Cell>
        <Cell
          title="有效日"
          showArrow
        ></Cell>
      </>
    </Cell.Group>
    <Picker
      value={[types[eTime.type]]}
      columns={[types.map(v => ({ value: v, label: v }))]}
      visible={typeVisible}
      onCancel={() => setBeginVisible(false)}
      onConfirm={(val) => {
        // setETime({ ...eTime, beginDate: val.toLocaleDateString() });
        setTypeVisible(false);
      }}
    ></Picker>
    <DatePicker
      value={new Date(eTime.beginDate) || new Date}
      visible={beginVisible}
      onCancel={() => setBeginVisible(false)}
      onConfirm={(val) => {
        setETime({ ...eTime, beginDate: val.toLocaleDateString() });
        setBeginVisible(false);
      }}
    ></DatePicker>
    <DatePicker
      value={new Date(eTime.endDate) || new Date}
      visible={endVisible}
      onCancel={() => setEndVisible(false)}
      onConfirm={(val) => {
        setETime({ ...eTime, endDate: val.toLocaleDateString() });
        setEndVisible(false);
      }}
    ></DatePicker>
  </div>;
}