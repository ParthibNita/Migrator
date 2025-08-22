import { useState, useEffect } from 'react';
import { LoginPage } from './Pages/LoginPage.jsx';
import { DashboardPage } from './Pages/DashboardPage.jsx';

function App() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    // console.log('App.jsx:', token);

    if (token) {
      setAccessToken(token);
      window.history.pushState({}, document.title, '/');
    }
  }, []);

  return (
    <div className="App">
      {accessToken ? (
        <DashboardPage accessToken={accessToken} />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
