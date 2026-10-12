import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Sparkles, 
  Coins, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setUnreadNotifications(res.data.unreadCount || 0);
        }
      } catch (err) {
        // silent fail on notification poll
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // 15s polling
    return () => clearInterval(interval);
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px'
      }}>
        {/* Brand Logo */}
        <Link 
          to={isAuthenticated ? '/dashboard' : '/'} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)' 
            }}>
              Peer<span style={{ color: 'var(--primary)' }}>Skill</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.675rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '-3px'
            }}>
              College Exchange
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {isAuthenticated ? (
            <>
              {/* Credit Balance Badge */}
              <Link 
                to="/progress"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.875rem',
                  backgroundColor: 'var(--warning-light)',
                  border: '1px solid var(--warning-border)',
                  borderRadius: 'var(--radius-full)',
                  color: '#92400e',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'transform var(--transition-fast)'
                }}
                title="Your available skill credits. Earn more by teaching peers!"
              >
                <Coins size={16} color="#d97706" />
                <span>{user?.credits ?? 10} Credits</span>
              </Link>

              {/* Notification Icon */}
              {/* Notification Icon with Live Badge */}
              <Link
                to="/notifications"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  position: 'relative',
                  textDecoration: 'none'
                }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}>
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* User Profile Pill with Picture Avatar */}
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  overflow: 'hidden'
                }}>
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    user?.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div style={{ display: 'none', flexDirection: 'column' }} className="user-text-pill">
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, lineHeight: 1.2 }}>
                    {user?.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {user?.department?.split(' ')[0] || 'Student'}
                  </span>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: 600
                }}
              >
                <LogOut size={16} />
                <span style={{ display: 'none' }} className="user-text-pill">Logout</span>
              </button>
            </>
          ) : (
            <>
              {!isAuthPage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Link 
                    to="/login" 
                    className="btn btn-outline"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Get Started Free <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile hamburger menu */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '0.25rem'
              }}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Dashboard</Link>
          <Link to="/matches" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Skill Matches</Link>
          <Link to="/discover" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Discover Students</Link>
          <Link to="/skills" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>My Skills</Link>
          <Link to="/sessions" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>My Sessions</Link>
          <Link to="/progress" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Learning Progress</Link>
          <Link to="/reviews" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Reviews & Ratings</Link>
          <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>Notifications</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--danger)' }}>Admin Dashboard</Link>
          )}
          <hr style={{ borderColor: 'var(--border-light)' }} />
          <button 
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
