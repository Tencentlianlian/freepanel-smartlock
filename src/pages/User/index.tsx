import  { UserList } from './UserList';
import  { UserAdd } from './UserAdd';

export const routeChildren = [
  {
    path: 'list',
    element: <UserList />
  },
  {
    path: 'add',
    element: <UserAdd />
  },
];