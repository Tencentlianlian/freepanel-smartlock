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
    editUser: (userInfo: UserInfo, index?: number) => Promise<void>,
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

  const editUser = async (userInfo: UserInfo, index = userIndex) => {
    await sdk.callDeviceAction({
      ...userInfo,
      effectiveTime: userInfo.effectiveTime || '',
    }, 'edit_user');
  };

  const addUser = async (userInfo: Pick<UserInfo, 'userid' | 'name'>) => {
    await sdk.callDeviceAction({
      ...userInfo,
    }, 'add_user');
  };
  return [{ userInfo: userData, userIndex }, { deleteUser, editUser, addUser }];
};
