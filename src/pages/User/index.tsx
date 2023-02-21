import  { UserList } from './UserList';
import  { UserAdd } from './UserAdd';
import  { UserEdit } from './UserEdit';

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
];