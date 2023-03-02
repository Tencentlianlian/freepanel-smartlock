import  { UserList } from './UserList';
import  { UserEdit } from './UserEdit';
import  { UserPwdAdd } from './UserPwdAdd';
import  { UserSetting } from './UserSetting';

export const routeChildren = [
  {
    path: 'list',
    element: <UserList />
  },
  {
    path: 'edit/:id',
    element: <UserEdit />
  },
  {
    path: 'password-add',
    element: <UserPwdAdd />
  },
  {
    path: 'info/:id',
    element: <UserSetting />
  },
];