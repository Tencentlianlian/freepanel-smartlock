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

interface UserInfo {
  name: string;
  userid: string;
  fingerprints: Auth[];
  passwords: Auth[];
  faces: Auth[];
  cards: Auth[];
  effectiveTime: EffectiveTime | string;
}
type UserResult = [
  { userInfo: UserInfo, userIndex: number },
  {
    deleteUser: (userid) => Promise<void>,
    editUser: (userInfo: UserInfo, index?: number) => Promise<void>,
  }
];

export const useUser = ({ id, name }: { id: string, name?: string }): UserResult => {
  const [{ deviceData }] = useDeviceInfo();
  const {
    users = [],
    fingerprints = [],
    cards = [],
    faces = [],
    passwords = [],
  } = deviceData;
  const userIndex = users.findIndex((user: UserInfo) => user.userid === id);
  const userInfo = users[userIndex] || { name, userid: id, effectiveTime: '{}' };
  const userData = {
    ...userInfo,
    effectiveTime: JSON.parse(userInfo.effectiveTime || '{}'),
    passwords: passwords.filter(item => item.userid === userInfo.userid),
    fingerprints: fingerprints.filter(item => item.userid === userInfo.userid),
    cards: cards.filter(item => item.userid === userInfo.userid),
    faces: faces.filter(item => item.userid === userInfo.userid),
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
  return [{ userInfo: userData, userIndex }, { deleteUser, editUser }];
};
