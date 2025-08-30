import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './Pages/DashboardPage.jsx';
import Navbar from './components/Navbar.jsx';
import { PlaylistPage } from './Pages/PlaylistPage.jsx';
import Loader from './components/Loader.jsx';
import Background from './components/Background.jsx';
import useAuthStore from './store/AuthStore.jsx';
import { useEffect } from 'react';
import { HomePage } from './Pages/HomePage.jsx';
import AuthGuard from './components/AuthGuard.jsx';
import Layout from './components/Layout.jsx';

function App() {
  const { loading, verifyUser, user } = useAuthStore();

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <Router>
      <div className="App  min-h-screen relative">
        <Background />
        {loading ? (
          <div className="min-h-screen backdrop-blur-3xl flex items-center justify-center">
            <Loader height={300} />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }
            >
              <Route path="/playlists/:id" element={<PlaylistPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
