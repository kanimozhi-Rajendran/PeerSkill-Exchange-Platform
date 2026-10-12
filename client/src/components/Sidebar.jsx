import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GitCompare,
  Compass,
  Award,
  CalendarCheck,
  TrendingUp,
  Star,
  Bell,
  ShieldCheck,
  Coins
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/matches', label: 'Skill Matches', icon: GitCompare, badge: 'Mutual' },
    { to: '/discover', label: 'Discover Students', icon: Compass },
    { to: '/skills', label: 'Manage Skills', icon: Award },
    { to: '/sessions', label: 'My Sessions', icon: CalendarCheck },
    { to: '/progress', label: 'Learning Progress', icon: TrendingUp },
    { to: '/reviews', label: 'Reviews & Ratings', icon: Star },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ];

  if (user?.role === 'admin') {
    navLinks.push({
      to: '/admin',
      label: 'Admin Portal',
      icon: ShieldCheck,
      admin: true
    });
  }

  return (
    <aside className="sidebar-desktop" style={{
      padding: '1.5rem 1rem',
      height: 'calc(100vh - 68px)',
      position: 'sticky',
      top: '68px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
          padding: '0 0.75rem 0.75rem 0.75rem'
        }}>
          Navigation Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {item.badge}
                  </span>
                )}
                {item.admin && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    backgroundColor: 'var(--danger-light)',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Admin
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Student Skill Credits Banner */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <Coins size={18} color="#d97706" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Skill Credit Economy
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Teach a peer to earn <strong>+5 credits</strong> per completed session. Use credits to book new mentors!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
