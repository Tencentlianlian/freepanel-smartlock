import { Popup, Button } from 'antd-mobile';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import './index.less';

interface PickerProps<T> {
  value: T[],
  onChange: (value: T[]) => void,
  options: { label: string; value: T }[],
  visible: boolean;
  title?: string;
  onClose?: () => void
}

export function WeekPicker<T>({ value = [], onChange, onClose, title, options = [], visible }: PickerProps<T>) {
  const [checked, setChecked] = useState(value);
  useEffect(() => {
    setChecked(value);
  }, [value]);
  const onOptionChange = (option) => {
    const { value } = option;
    const index = checked.indexOf(value);
    console.log(checked, value, index);
    if (index !== -1) {
      console.log('remove');
      setChecked([
        ...checked.slice(0, index),
        ...checked.slice(index + 1),
      ]);
    } else {
      checked.push(option.value);
      console.log({ checked });
      setChecked([...checked]);
    }
  };

  const optionsEl = <div className="iotp-picker-bd">
    {
      options.map((opt) => <div
        className='iotp-picker-opt'
        key={opt.label}
      >
        <div>{opt.label}</div>
        <div
          className={classNames('iotp-picker-icon',{ checked: checked.indexOf(opt.value) !== -1 })}
          onClick={() => onOptionChange(opt)}
        ></div>
      </div>)
    }
  </div>;

  return <Popup
    visible={visible}
    forceRender
    position="bottom"
    className='iotp-picker'
    onClose={onClose}
    onMaskClick={onClose}
    bodyStyle={{
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    }}
  >
    <div className="iotp-picker-hd">
      <a
        role="button"
        onClick={() => onClose && onClose()}
      >取消</a>
      <div className="iotp-picker-hd-title">{title}</div>
      <a
        role="button"
        onClick={() => onChange(checked.sort())}
      >确定</a>
    </div>
    {optionsEl}
  </Popup>;
}