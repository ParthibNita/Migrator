import { useState, useEffect } from 'react';
import LoginPage from './Pages/LoginPage.jsx';

function App() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');

    if (token) {
      setAccessToken(token);
      window.history.pushState({}, document.title, '/');
    }
  }, []);

  return (
    <div className="App">
      {accessToken ? (
        <div>
          <h1>Logged In Successfully!</h1>
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
