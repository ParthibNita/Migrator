import { useState, useEffect } from 'react';
import { LoginPage } from './Pages/LoginPage.jsx';
import { DashboardPage } from './Pages/DashboardPage.jsx';
import { useAuth } from './hooks/useAuth.js';
import Navbar from './components/Navbar.jsx';

function App() {
  const { accessToken, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-cyan-600">Loading...</p>
      </div>
    );
  }
  return (
    <div className="App bg-neutral-900 min-h-screen text-white">
      {user && <Navbar />}
      {accessToken ? <DashboardPage /> : <LoginPage />}
    </div>
  );
}

export default App;
