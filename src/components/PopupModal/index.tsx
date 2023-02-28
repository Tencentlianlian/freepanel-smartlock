import { Popup, PopupProps } from 'antd-mobile';

export interface PopupModalProps extends PopupProps{
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export function PopupModal(props: PopupModalProps) {
  const { onClose, title, cancelText, confirmText, ...others } = props;
  return <Popup
    {...others}
    onMaskClick={onClose}
  >
    <div className="iotp-timespan-hd">
      {cancelText && <a
        role="button"
        onClick={() => onClose && onClose()}
      >取消</a>}
      <div className="iotp-picker-hd-title">{title}</div>
      <a
        role="button"
        onClick={}
      >确定</a>
    </div>
    {props.children}
  </Popup>;
}