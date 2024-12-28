import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import axios from 'axios';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'antd/dist/reset.css';
import PrivateRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Course';
import Teachers from './pages/Teachers';

function App() {
  const { user, login, logout } = useAuthStore();

  axios.defaults.withCredentials = true;

  // Check user authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/self`);
        if (response.status === 200) {
          login(response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
        } else {
          console.error('Error checking authentication status:', error);
          logout();
        }
      } finally {
        useAuthStore.getState().setLoading(false); // Ensure loading is set to false
      }
    };

    checkAuthStatus();
  }, [login, logout]);

  return (
    <Router>
      <div className="bg-violet-50">
        <Header />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Render Sidebar only if the user is logged in */}
          {user && <Sidebar />}
          <main style={{ flexGrow: 1, }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/teachers"
                element={
                  <PrivateRoute>
                    <Teachers />
                  </PrivateRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <PrivateRoute>
                    <Courses />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </Router>
  );
}

export default App;
