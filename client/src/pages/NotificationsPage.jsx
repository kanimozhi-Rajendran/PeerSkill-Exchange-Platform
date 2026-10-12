import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, EmptyState } from '../components/StatCard';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Award, 
  Star, 
  Coins, 
  ArrowRight 
} from 'lucide-react';

const NotificationsPage = () => {
  const { showToast } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.data.success) {
        showToast('All notifications marked as read.', 'info');
        fetchNotifications();
      }
    } catch (err) {
      showToast('Failed to mark notifications read.', 'error');
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'request_received':
      case 'request_accepted':
      case 'session_completed':
        return <Calendar size={18} color="var(--primary)" />;
      case 'review_received':
        return <Star size={18} color="#eab308" fill="#eab308" />;
      case 'credits_earned':
        return <Coins size={18} color="#d97706" />;
      default:
        return <Bell size={18} color="var(--secondary)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notification Center</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Real-time alerts for booking requests, status changes, reviews, and credits.
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-outline btn-sm">
            <CheckCheck size={16} /> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingSpinner text="Loading notifications..." />
      ) : notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => {
            const timeAgo = new Date(n.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={n._id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: n.isRead ? '#ffffff' : '#f8faff',
                  borderLeft: `4px solid ${n.isRead ? 'var(--border-light)' : 'var(--primary)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.125rem'
                  }}>
                    {getIconForType(n.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          New
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.375rem', display: 'block' }}>
                      {timeAgo}
                    </span>
                  </div>
                </div>

                {n.link && (
                  <Link
                    to={n.link}
                    className="btn btn-outline btn-sm"
                    style={{ flexShrink: 0, alignSelf: 'center' }}
                  >
                    View <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You're all caught up! New requests and updates will appear here in real-time."
        />
      )}
    </div>
  );
};

export default NotificationsPage;
