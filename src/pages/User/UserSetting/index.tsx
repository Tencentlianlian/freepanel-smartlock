import { Cell } from 'qcloud-iot-panel-component';
import { useParams } from 'react-router-dom';
import { useUser } from '@src/hooks/useUser';
import { Picker, DatePicker } from 'antd-mobile';
import { WeekPicker } from '@src/components/WeekPicker';
import { TimeSpanPicker } from '@src/components/TimeSpanPicker';
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
  const [weekVisible, setWeekVisible] = useState(false);
  const [timespanVisible, setTimespanVisible] = useState(true);
  const weeks = '周一 周二 周三 周四 周五 周六 周日'.split(' ');

  const types = ['永久有效', '周期有效'];
  return <div className='page user-setting'>
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
      {eTime.type ===  1 && <>
        <Cell
          title="开始日期"
          footer={eTime.beginDate}
          onClick={() => setBeginVisible(true)}
          showArrow
        ></Cell>
        <Cell
          title="结束日期"
          footer={eTime.endDate}
          onClick={() => setEndVisible(true)}
          showArrow
        ></Cell>
        <Cell
          title="有效时间段"
          footer={`${eTime.beginTime}~${eTime.endTime}`}
          showArrow
          onClick={() => setTimespanVisible(true)}
        ></Cell>
        <Cell
          title="有效日"
          onClick={() => setWeekVisible(true)}
          footer={eTime.week?.map(v => <span key= {v}>{weeks[v]}&nbsp;</span>)}
          showArrow
        ></Cell>
      </>}
    </Cell.Group>
    <Picker
      value={[types[eTime.type]]}
      columns={[types.map(v => ({ value: v, label: v }))]}
      visible={typeVisible}
      onCancel={() => setTypeVisible(false)}
      onConfirm={(val) => {
        console.log(val);
        setETime({ ...eTime, type: types.indexOf(val[0] as string) as 0 | 1 });
        setTypeVisible(false);
      }}
    ></Picker>
    <DatePicker
      value={new Date(eTime.beginDate || Date.now()) || new Date}
      visible={beginVisible}
      title="开始日期"
      defaultValue={new Date}
      onCancel={() => setBeginVisible(false)}
      onConfirm={(val) => {
        setETime({ ...eTime, beginDate: val.toLocaleDateString() });
        setBeginVisible(false);
      }}
    ></DatePicker>
    <DatePicker
      value={new Date(eTime.endDate) || new Date}
      title="结束日期"
      visible={endVisible}
      onCancel={() => setEndVisible(false)}
      onConfirm={(val) => {
        setETime({ ...eTime, endDate: val.toLocaleDateString() });
        setEndVisible(false);
      }}
    ></DatePicker>
    <WeekPicker<number>
      value={eTime.week}
      onChange={(value) => {
        setETime({ ...eTime, week: value });
        setWeekVisible(false);
      }}
      title="有效日"
      visible={weekVisible}
      options={weeks.map((w, idx) => ({ label: w, value: idx }))}
      onClose={() => setWeekVisible(false)}
    />
    <TimeSpanPicker
      value={[eTime.beginTime, eTime.endTime]}
      onChange={(value) => {
        setTimespanVisible(false);
        setETime({
          ...eTime,
          beginTime: value[0],
          endTime: value[1],
        });
      }}
      visible={timespanVisible}
      onClose={() => setTimespanVisible(false)}
    />
  </div>;
}