import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage.jsx';
import { DashboardPage } from './Pages/DashboardPage.jsx';
import { useAuth } from './hooks/useAuth.js';
import Navbar from './components/Navbar.jsx';
import { PlaylistPage } from './Pages/PlaylistPage.jsx';
import Loader from './components/Loader.jsx';
import Background from './components/Background.jsx';

function App() {
  const { accessToken, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader height={300} />
      </div>
    );
  }
  return (
    <Router>
      <div className="App  min-h-screen relative">
        <Background />
        {user && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={accessToken ? <DashboardPage /> : <LoginPage />}
          />
          <Route
            path="/playlists/:id"
            element={accessToken ? <PlaylistPage /> : <LoginPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
