const LoginPage = () => {
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8888/api/spotify/login');
      const data = await response.json();

      window.location.href = data.url;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Migrator</h1>
      <p>The bridge between your music libraries.</p>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default LoginPage;
