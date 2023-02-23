import { FingerImg, PwdImg, CardImg, FaceImg } from '@src/assets/pwd';

export const iconMap = {
  finger: FingerImg,
  card: CardImg,
  pwd: PwdImg,
  face: FaceImg
};
export const nameMap = {
  finger: '指纹',
  card: '卡片',
  pwd: '数字密码',
  face: '面部'
};
export const deviceNameMap = {
  finger: '指纹识别区',
  card: '门锁刷卡区',
  pwd: '门锁密码识别区',
  face: '门锁摄像头前'
};
export const actionMap = {
  finger: '按压指纹',
  card: '贴近卡片',
  pwd: '输入密码',
  face: '录入面部识别内容'
};
export const actionNameMap = {
  finger: 'fingerprint',
  card: 'card',
  pwd: 'password',
  face: 'face'
};