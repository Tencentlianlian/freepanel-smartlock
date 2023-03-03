import { Popup, PopupProps, SafeArea } from 'antd-mobile';

export interface PopupModalProps extends PopupProps{
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export function PopupModal(props: PopupModalProps) {
  const { onClose, title, cancelText = '取消', confirmText = '确定', onConfirm, ...others } = props;
  return <Popup
    {...others}
    onMaskClick={onClose}
  >
    <div className="iotp-picker-hd">
      {cancelText && <a
        role="button"
        onClick={() => onClose && onClose()}
      >取消</a>}
      <div className="iotp-picker-hd-title">{title}</div>
      <a
        role="button"
        onClick={onConfirm}
      >确定</a>
    </div>
    {props.children}
    <SafeArea position='bottom'/>
  </Popup>;
}