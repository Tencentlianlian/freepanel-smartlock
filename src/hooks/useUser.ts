import { useDeviceInfo } from './useDeviceData';
const sdk = window.h5PanelSdk;
type Auth = {
  name?: string;
  id: string;
}

export interface EffectiveTime {
  type: 0 | 1,
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  week: number[];
}

export interface UserInfo {
  name: string;
  userid: string;
  fingerprints: Auth[];
  passwords: Auth[];
  faces: Auth[];
  cards: Auth[];
  effectiveTime: EffectiveTime;
}
type UserResult = [
  { userInfo: UserInfo, userIndex: number },
  {
    deleteUser: (userid) => Promise<void>,
    editUser: (userInfo: Pick<UserInfo, 'userid' | 'name' | 'effectiveTime'>, index?: number) => Promise<void>,
    addUser: (userInfo: Pick<UserInfo, 'userid' | 'name'>) => Promise<void>
  }
];

export const getPwdsById = (id: string, deviceData) => {
  const {
    fingerprints = [],
    cards = [],
    faces = [],
    passwords = [],
  } = deviceData;
  return {
    passwords: passwords.filter(item => item.userid === id),
    fingerprints: fingerprints.filter(item => item.userid === id),
    cards: cards.filter(item => item.userid === id),
    faces: faces.filter(item => item.userid === id),
  };
};

export const authNames = {
  passwords: '密码',
  fingerprints: '指纹',
  cards: '卡片',
  faces: '面容',
};

export const getEffectiveTime = (effectiveTime: EffectiveTime) => {
  if (effectiveTime.type === 0) {
    return '永久有效';
  }
  const {
    beginDate,
    endDate,
    beginTime,
    endTime
  } = effectiveTime;
  return `${beginDate}-${endDate}每天${beginTime}-${endTime}有效`;
};

export const useUser = ({ id, name }: { id: string, name?: string }): UserResult => {
  const [{ deviceData }] = useDeviceInfo();
  const {
    users = [],
  } = deviceData;
  const userIndex = users.findIndex((user: UserInfo) => user.userid === id);
  const userInfo = users[userIndex] || { name, userid: id, effectiveTime: '{}' };

  const userData = {
    ...userInfo,
    effectiveTime: JSON.parse(userInfo.effectiveTime || '{}') as EffectiveTime,
    ...getPwdsById(id, deviceData),
  };

  const deleteUser = async (userid) => {
    await sdk.callDeviceAction({ userid }, 'delete_user');
  };

  const editUser = async (userInfo, index = userIndex) => {
    await sdk.callDeviceAction({
      ...userInfo,
      effectiveTime: JSON.stringify(userInfo.effectiveTime) || '',
    }, 'edit_user');
  };

  const addUser = async (userInfo: Pick<UserInfo, 'userid' | 'name'>) => {
    await sdk.callDeviceAction({
      ...userInfo,
    }, 'add_user');
  };
  return [{ userInfo: userData, userIndex }, { deleteUser, editUser, addUser }];
};
