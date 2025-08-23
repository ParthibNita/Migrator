import { useState, useEffect } from 'react';
import { LoginPage } from './Pages/LoginPage.jsx';
import { DashboardPage } from './Pages/DashboardPage.jsx';

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('spotify_accesstoken')
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    const expiry = urlParams.get('expires_in');

    if (token && expiry) {
      setAccessToken(token);
      localStorage.setItem('spotify_accesstoken', token);
      localStorage.setItem(
        'spotify_expiry',
        Date.now() + parseInt(expiry) * 1000
      );
      window.history.pushState({}, document.title, '/');
    }
  }, []);

  return (
    <div className="App text-center p-4">
      {accessToken ? (
        <DashboardPage accessToken={accessToken} />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
