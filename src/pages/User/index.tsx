import  { UserList } from './UserList';
import  { UserAdd } from './UserAdd';
import  { UserEdit } from './UserEdit';
import  { UserPwdAdd } from './UserPwdAdd';
import  { UserSetting } from './UserSetting';

export const routeChildren = [
  {
    path: 'list',
    element: <UserList />
  },
  {
    path: 'add',
    element: <UserAdd />
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