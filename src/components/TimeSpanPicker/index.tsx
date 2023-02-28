import { PickerView, Popup } from 'antd-mobile';
import { useState } from 'react';
import './index.less';

interface TimeSpanPickerProps {
  onChange: (value: string[]) => void,
  visible: boolean;
  value: string[],
  title?: string;
  onClose?: () => void
}

const hours = Array.from({ length: 24 }).map((v, index) => index >= 10 ? index.toString() : `0${index}`);
const mins = Array.from({ length: 60 }).map((v, index) => index >= 10 ? index.toString() : `0${index}`);

export function TimeSpanPicker({ value, onChange, visible, onClose, title,  }: TimeSpanPickerProps) {
  const [timespan, setTimespan] = useState(value.map(time => time?.split(':')));
  const columns = [
    hours.map(k => ({ label: k, value: k })),
    mins.map(k => ({ label: k, value: k })),
  ];
  return <Popup
    visible={visible}
    onClose={onClose}
    className="iotp-timespan"
    bodyStyle={{
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    }}
  >
    <div className="iotp-timespan-hd">
      <a
        role="button"
        onClick={() => onClose && onClose()}
      >取消</a>
      <div className="iotp-picker-hd-title">{title}</div>
      <a
        role="button"
        onClick={() => onChange(timespan.map(time => time.join(':')))}
      >确定</a>
    </div>
    <div className="iotp-timespan-bd">
      <PickerView
        columns={columns}
        value={timespan[0]}
        onChange={value => {
          console.log('start', value);
          setTimespan([value, timespan[1]]);
        }}
      ></PickerView>
      <span style={{ width: 20 }}>—</span>
      <PickerView
        columns={columns}
        value={timespan[1]}
        onChange={value => {
          console.log('end', value);
          setTimespan([timespan[0], value]);
        }}
      ></PickerView>
    </div>
  </Popup>;
};