import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { LoadingSpinner } from './components/StatCard';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SkillsPage from './pages/SkillsPage';
import MatchResultsPage from './pages/MatchResultsPage';
import DiscoverPage from './pages/DiscoverPage';
import SessionsPage from './pages/SessionsPage';
import ProgressPage from './pages/ProgressPage';
import ReviewsPage from './pages/ReviewsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Checking authentication status..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Verifying administrator credentials..." />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Layout Shell
const AppLayout = ({ children, hideSidebar = false }) => {
  const { isAuthenticated } = useAuth();
  const showSidebar = isAuthenticated && !hideSidebar;

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content-wrapper">
        {showSidebar && <Sidebar />}
        <main className={showSidebar ? 'page-container' : 'container'} style={{ flex: 1 }}>
          {children}
        </main>
      </div>
      <Footer />
      <Toast />
    </div>
  );
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Initializing PeerSkill Exchange..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <AppLayout hideSidebar={true}>
            <LandingPage />
          </AppLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AppLayout hideSidebar={true}>
            <LoginPage />
          </AppLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AppLayout hideSidebar={true}>
            <RegisterPage />
          </AppLayout>
        }
      />

      {/* Protected Student Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SkillsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MatchResultsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DiscoverPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SessionsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProgressPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReviewsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotificationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Page */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminPage />
            </AppLayout>
          </AdminRoute>
        }
      />

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <AppLayout hideSidebar={true}>
            <NotFoundPage />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
