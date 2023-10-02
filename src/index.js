import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Ru from "./Ru";
import De from "./De";
import En from "./En";
import ErrorRoute from './ErrorRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Rewards from "./subroutes/Rewards";

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorRoute />,
    children: [
      {
        path: "/",
        children: [
          {
            path: "/",
            element: <Ru />,
            index: true,
          },
          {
            path: "rewards",
            element: <Rewards />
          },
        ]
      },
      { //dont forget to update deutsch
        path: "/de",
        children: [
          {
            path: "/de",
            element: <De />,
            index: true
          },
          {
            path: "rewards",
            element: <Rewards />
          }
        ]
      },
      {
        path: "/en",
        children: [
          {
            path: "/en",
            element: <En />,
            index: true
          },
          {
            path: "rewards",
            element: <Rewards />
          }
        ]
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);