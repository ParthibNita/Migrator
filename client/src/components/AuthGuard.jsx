import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore.jsx';
import Loader from './Loader.jsx';

const AuthGuard = ({ children }) => {
  const { accessToken, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader height={300} />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthGuard;
