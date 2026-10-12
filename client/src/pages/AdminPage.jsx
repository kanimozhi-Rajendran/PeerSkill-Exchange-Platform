import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard, LoadingSpinner } from '../components/StatCard';
import { 
  ShieldCheck, 
  Users, 
  CalendarCheck, 
  Coins, 
  UserX, 
  UserCheck, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react';

const AdminPage = () => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, sessionsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/sessions')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsersList(usersRes.data.users || []);
      if (sessionsRes.data.success) setSessionsList(sessionsRes.data.sessions || []);
    } catch (err) {
      console.error('Admin load error:', err);
      showToast('Failed to load admin telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (targetUserId, currentStatus) => {
    const action = currentStatus === false ? 'activate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} this student account?`)) return;

    try {
      const res = await api.put(`/admin/users/${targetUserId}/toggle-status`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading platform administration console..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-danger">
              <ShieldCheck size={12} /> Administrator Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Governance & Moderation</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Overseeing student exchanges, account moderation, and platform activity metrics.
          </p>
        </div>

        <button onClick={fetchAdminData} className="btn btn-outline btn-sm">
          <RefreshCw size={14} /> Refresh Telemetry
        </button>
      </div>

      {/* Platform Stats Grid */}
      <div className="grid-4">
        <StatCard
          title="Total Registered Students"
          value={stats?.totalStudents ?? 0}
          icon={Users}
          color="primary"
          subtext={`${stats?.activeStudents || 0} Active • ${stats?.suspendedStudents || 0} Suspended`}
        />
        <StatCard
          title="Total Scheduled Sessions"
          value={stats?.totalSessions ?? 0}
          icon={CalendarCheck}
          color="secondary"
          subtext={`${stats?.completedSessions || 0} Successfully Completed`}
        />
        <StatCard
          title="Distinct Skills Exchanged"
          value={stats?.distinctSkillsCount ?? 0}
          icon={ShieldCheck}
          color="success"
          subtext="Covering multiple departments"
        />
        <StatCard
          title="Credit Ledger Events"
          value={stats?.totalCreditTransactions ?? 0}
          icon={Coins}
          color="warning"
          subtext="Audited token movements"
        />
      </div>

      {/* Student Moderation Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Registered Students Moderation ({usersList.length})
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Inspect student profiles and suspend or reactivate accounts as needed.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Student Name</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem' }}>Department & Year</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => {
                const isActive = u.isActive !== false;
                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {u.department} ({u.yearOfStudy})
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-neutral'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                        {isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleToggleStatus(u._id, isActive)}
                          className={`btn ${isActive ? 'btn-danger' : 'btn-success'} btn-sm`}
                        >
                          {isActive ? <><UserX size={13} /> Suspend</> : <><UserCheck size={13} /> Activate</>}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Audit Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Platform Session Audit Log ({sessionsList.length})
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Full visibility into all peer exchange requests and lifecycle statuses.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Skill Topic</th>
                <th style={{ padding: '0.75rem' }}>Date & Time</th>
                <th style={{ padding: '0.75rem' }}>Duration</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Credits Rewarded</th>
              </tr>
            </thead>
            <tbody>
              {sessionsList.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{s.skillName}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{s.date} at {s.time}</td>
                  <td style={{ padding: '0.75rem' }}>{s.durationMinutes || 60} mins</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge status-${s.status}`} style={{ textTransform: 'capitalize' }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700 }}>
                    {s.creditsAwarded ? 'Yes (+5 🪙)' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
