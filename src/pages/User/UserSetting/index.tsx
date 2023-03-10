import { Cell } from 'qcloud-iot-panel-component';
import { useParams } from 'react-router-dom';
import { useUser } from '@src/hooks/useUser';
import { Picker, DatePicker, Input } from 'antd-mobile';
import { useTitle } from '@src/hooks/useTitle';
import { WeekPicker } from '@src/components/WeekPicker';
import dayjs from 'dayjs';
import { TimeSpanPicker } from '@src/components/TimeSpanPicker';
import { PopupModal } from '@src/components/PopupModal';
import { useState, useEffect } from 'react';

import './index.less';

export function UserSetting() {
  const { id } = useParams();
  const [{ userInfo }, { editUser }] = useUser({ id: id as string });
  const { effectiveTime } = userInfo;
  const [eTime, setETime] = useState(effectiveTime);
  const [beginVisible, setBeginVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [weekVisible, setWeekVisible] = useState(false);
  const [timespanVisible, setTimespanVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [name, setName] = useState(userInfo.name);
  const weeks = '周一 周二 周三 周四 周五 周六 周日'.split(' ');

  const types = ['永久有效', '周期有效'];

  const renderWeek = () => {
    if (eTime.week?.length === 7) {
      return '周一 ～ 周日';
    }
    return eTime.week?.map(v => <span key= {v}>{weeks[v]}&nbsp;</span>);
  };

  useTitle('用户设置');

  useEffect(() => {
    console.log({ eTime });
    if (!eTime || Object.keys(eTime).length === 0) {
      return;
    }
    editUser({
      userid: userInfo.userid,
      name: userInfo.name,
      effectiveTime: eTime
    }).catch(err => {
      console.warn('编辑失败', err);
      window.h5PanelSdk.tips.showError('保存失败');
    });
  }, [eTime]);

  const editUserName = (name) => {
    console.log('edit User name');
    editUser({
      userid: userInfo.userid,
      name: name,
      effectiveTime: eTime
    }).catch(err => {
      console.warn('编辑失败', err);
      window.h5PanelSdk.tips.showError('保存失败');
    });
  };
  return <div className='page user-setting'>
    <Cell
      title="用户名称"
      showArrow
      onClick={() => setNameVisible(true)}
      footer={
        userInfo.name
      }
    />
    <Cell.Group style={{ marginTop: 12 }}>
      <Cell
        title="权限类型"
        footer={types[eTime.type]}
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
          footer={eTime.beginTime && eTime.endTime ? `${eTime.beginTime}~${eTime.endTime}` : ''}
          showArrow
          onClick={() => setTimespanVisible(true)}
        ></Cell>
        <Cell
          title="有效日"
          onClick={() => setWeekVisible(true)}
          footer={renderWeek()}
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
        const selectedType = types.indexOf(val[0] as string) as 0 | 1;
        if (Object.keys(eTime).length === 0 && selectedType === 1) {
          setETime({ ...eTime,
            type: selectedType,
            beginDate: dayjs().format('YYYY/MM/DD'),
            endDate: dayjs().add(1, 'year').format('YYYY/MM/DD'),
            beginTime: '00:00',
            endTime: '23:59',
            week: [0,1,2,3,4,5,6]
          });
        } else {
          setETime({ ...eTime, type: selectedType });
        }
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
        setETime({ ...eTime, beginDate: dayjs(val).format('YYYY/MM/DD') });
        setBeginVisible(false);
      }}
    ></DatePicker>
    <DatePicker
      value={new Date(eTime.endDate) || new Date}
      title="结束日期"
      min={new Date(eTime.beginDate)}
      visible={endVisible}
      onCancel={() => setEndVisible(false)}
      onConfirm={(val) => {
        setETime({ ...eTime, endDate: dayjs(val).format('YYYY/MM/DD') });
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
      title="有效时间段"
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
    <PopupModal
      visible={nameVisible}
      onClose={() => setNameVisible(false)}
      onConfirm={() => {
        setNameVisible(false);
        editUserName(name);
      }}
    >
      <div className='name-input'>
        <Input
          autoFocus
          value={name}
          maxLength={5}
          onChange={(val) => setName(val)}
          placeholder="请输入用户名"
        ></Input>
      </div>
    </PopupModal>
  </div>;
}