import React from 'react';
import ReactDOM from 'react-dom';
import { Home, Password } from './pages';
import 'qcloud-iot-panel-component/lib/index.css'

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/password",
    element: <Password />,
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.render(<App />, document.getElementById('app'));
