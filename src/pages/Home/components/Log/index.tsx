import { Timeline } from '@components/Timeline';
import React, { useState, useEffect, useMemo } from 'react';
import { useLoadMore } from '@src/hooks/useLoadMore';
import { InfiniteScroll } from 'antd-mobile';
import { useDeviceInfo } from '@src/hooks';
import './index.less';
import dayjs from 'dayjs';

const eventMap: Record<string, string> = {
  doorbell: '门铃呼叫',
  unlock_fingerprint: '指纹解锁',
  unlock_card: '卡片解锁',
  unlock_password: '密码解锁',
  unlock_face: '人脸解锁',
  alarm_lock: '门锁告警',
  unlock_key: '钥匙解锁',
  unlock_temporary_password: '临时密码解锁',
  unlock_onetime_password: '临时密码解锁',
  unlock_cycle_password: '周期密码解锁',
  add_fingerprint_result: '上报指纹添加成功',
  add_password_result: '上报密码添加成功',
  add_card_result: '上报卡片添加成功',
  add_face_result: '上报人脸添加成功',
  door_locked: '门已上锁',
  open_inside: '门从内侧打开',
  unlock_remote_result: '远程解锁',
};
type LogItem = { label: string, time: string, data: any, event: string, type: 'info' | 'alert' };
interface Log{
  hasMore: boolean,
  context: string;
  children: LogItem[]
}

export function Log({ date, logType }) {
  const [data, setData] = useState<LogItem[]>([]);
  const [{ templateMap: dataTemplateEventMap }] = useDeviceInfo();
  const alarmTipMap = dataTemplateEventMap.alarm_lock.params[0].define.mapping;
  const sdk = window.h5PanelSdk;
  const [isLoaded, setLoaded] = useState(false);
  const isEmpty = isLoaded && !data.length;
  const getEventlog = async (context: string): Promise<Log> => {
    // tips.showLoading();
    const res = await sdk.requestTokenApi('AppListEventHistory', {
      DeviceId: sdk.deviceId,
      Context: context,
      StartTime: Math.floor(+dayjs(date).startOf('day') / 1000),
      EndTime: Math.floor(+dayjs(date).endOf('day') / 1000),
      Size: 20,
    });
    const logList = res.EventHistory;
    return {
      hasMore: !res.Listover,
      context: res.Context,
      children: logList.map((log: any) => ({
        label: eventMap[log.EventId],
        event: log.EventId,
        type: log.Type,
        data: JSON.parse(log.Data),
        time: dayjs(log.TimeStamp).format('HH:mm'),
      })),
    };
  };
  // 后端加载日志数据
  const loadLog = async (context) => {
    try {
      const logList = await getEventlog(context);
      setLoaded(true);
      setData([...data, ...logList.children]);
      return logList;
    } catch (err) {
      console.error('get log err', err);
      // tips.showError('获取日志信息出错');
      throw err;
    }
  };
  const { loadMore, hasMore, reset } = useLoadMore(loadLog);
  const renderLabelNode = ({ label, data, event }: LogItem) => {
    let labelNode: React.ReactNode = label;
    switch (label) {
      case '门锁告警':
        labelNode = (
          <div>{label}: <span className='adm-step-description'>
            {alarmTipMap[data.alarm_tip]}
          </span>
          </div>
        );
        break;
      case '指纹解锁':
      case '卡片解锁':
      case '密码解锁':
      case '人脸解锁': {
        // id可能是由name+分隔符+id构成的字符串
        const [id, name] = data.id.split(SPLIT_STR);
        if (name) {
          labelNode = `${name}使用${label}`;
        }
      }
        break;
    }
    return labelNode;
  };
  useEffect(() => {
    setData([]);
    reset();
    setLoaded(false);
  }, [date]);

  const SPLIT_STR = '$*$';
  const filteredData = useMemo(() => {
    switch (logType) {
      case 'doorbell':
      case 'alarm_lock':
        return data.filter(item => item.event === logType);

      case 'all':
      default:
        return data;
    }
  }, [data, logType]);
  return (
    <div className="wrapper">
      <Timeline items={filteredData.map(item => {
        return {
          title: item.time,
          content: renderLabelNode(item),
          status: item.type,
        };
      })}/>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}