import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container" style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '3rem 1rem'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--danger-light)',
        color: 'var(--danger)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <AlertCircle size={32} />
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        404 - Page Not Found
      </h1>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '2rem' }}>
        The page you are looking for does not exist or has been moved to another location.
      </p>

      <Link
        to={isAuthenticated ? '/dashboard' : '/'}
        className="btn btn-primary"
      >
        <Home size={16} /> Return to {isAuthenticated ? 'Dashboard' : 'Home'}
      </Link>
    </div>
  );
};

export default NotFoundPage;
