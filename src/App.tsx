import ReactDOM from 'react-dom';
import { Home, Password, Setting } from './pages';
import { UserList } from './pages/User/UserList';
import { AppContext } from './context';
import 'qcloud-iot-panel-component/lib/index.css';
import './pages/index.less';

import {
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import { routeChildren } from './pages/User';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/password',
    element: <Password />,
  },
  {
    path: '/setting',
    element: <Setting />,
  },
  {
    path: '/user',
    element: <UserList />,
  },
  {
    path: '/user/*',
    children: routeChildren
  },
]);

function App() {
  return <AppContext.Provider value={{
    isForceOnline: false
  }}>
    <RouterProvider router={router} />
  </AppContext.Provider>;
}

ReactDOM.render(<App />, document.getElementById('app'));
