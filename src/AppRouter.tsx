import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Router';
import SessionChecker from './components/SessionChecker';

const AppRouter: React.FC = () => {
  return (
    <SessionChecker>
      <RouterProvider router={router} />
    </SessionChecker>
  );
};

export default AppRouter;