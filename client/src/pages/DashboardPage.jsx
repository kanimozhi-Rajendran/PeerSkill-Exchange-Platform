import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatCard, LoadingSpinner, EmptyState } from '../components/StatCard';
import MatchCard from '../components/MatchCard';
import BookSessionModal from '../components/BookSessionModal';
import PublicProfileModal from '../components/PublicProfileModal';
import { 
  Award, 
  BookOpen, 
  GitCompare, 
  Calendar, 
  Coins, 
  Star, 
  PlusCircle, 
  ArrowRight, 
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

const DashboardPage = () => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherSkills, setSelectedTeacherSkills] = useState([]);

  // Public Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);

  const handleOpenProfile = (student) => {
    setSelectedStudentForProfile(student);
    setProfileModalOpen(true);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, matchesRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/matches')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setRecentSessions(statsRes.data.recentSessions || []);
      }

      if (matchesRes.data.success) {
        setTopMatches(matchesRes.data.matches.slice(0, 2));
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenBooking = (teacher, skills) => {
    setSelectedTeacher(teacher);
    setSelectedTeacherSkills(skills || []);
    setBookingModalOpen(true);
  };

  const handleBookSession = async (bookingData) => {
    try {
      const res = await api.post('/sessions', bookingData);
      if (res.data.success) {
        showToast('Session request sent to peer mentor! 🎉', 'success');
        fetchDashboardData();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to book session.', 'error');
      return false;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your student dashboard..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student Hub
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.department}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            You have <strong>{stats?.mutualMatchesCount || 0} two-way mutual skill matches</strong> waiting. Teach skills to earn credits!
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/skills" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Add Teachable Skill
          </Link>
          <Link to="/matches" className="btn btn-outline btn-sm">
            <GitCompare size={15} /> View All Matches
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid-4">
        <StatCard
          title="Skills I Can Teach"
          value={stats?.skillsTeachableCount ?? 0}
          icon={Award}
          color="primary"
          subtext="Offer skills to peer learners"
        />
        <StatCard
          title="Skills I Want to Learn"
          value={stats?.skillsWantedCount ?? 0}
          icon={BookOpen}
          color="secondary"
          subtext="Used for mutual matching"
        />
        <StatCard
          title="Mutual Matches"
          value={stats?.mutualMatchesCount ?? 0}
          icon={GitCompare}
          color="success"
          subtext="True 2-way barter pairs"
        />
        <StatCard
          title="Credit Balance"
          value={`${stats?.credits ?? 10} 🪙`}
          icon={Coins}
          color="warning"
          subtext="+5 credits per session taught"
        />
      </div>

      {/* Secondary Metrics: Upcoming, Rating, Hours */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Upcoming Sessions</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats?.upcomingCount || 0} Scheduled</div>
            <Link to="/sessions" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Manage Sessions →</Link>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Star size={24} fill="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Peer Rating</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats?.averageRating || 5.0} / 5.0</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on {stats?.reviewCount || 0} reviews</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Exchange Time</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats?.totalExchangeHours || 0} Hours</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats?.hoursTaught || 0}h taught • {stats?.hoursLearned || 0}h learned</span>
          </div>
        </div>
      </div>

      {/* Top Mutual Matches Preview */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Top Two-Way Skill Matches</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Peers who want what you teach, and teach what you want to learn!
            </p>
          </div>
          <Link to="/matches" className="btn btn-outline btn-sm">
            View All ({stats?.matchesCount || 0}) <ArrowRight size={14} />
          </Link>
        </div>

        {topMatches.length > 0 ? (
          <div className="grid-2">
            {topMatches.map((m, idx) => (
              <MatchCard
                key={idx}
                match={m}
                onBookSession={handleOpenBooking}
                onViewProfile={handleOpenProfile}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={GitCompare}
            title="No Direct Matches Yet"
            description="Add more skills you can teach and skills you want to learn. Our algorithm continuously matches you with other students!"
            actionText="Add Skills"
            onAction={() => window.location.href = '/skills'}
          />
        )}
      </div>

      {/* Recent Sessions Overview */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Learning Sessions</h3>
          <Link to="/sessions" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            View All Sessions →
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentSessions.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.skillName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {s.date} at {s.time} • {s.durationMinutes || 60} mins
                  </div>
                </div>
                <span className={`badge status-${s.status}`} style={{ textTransform: 'capitalize' }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
            No sessions scheduled yet. Browse matches above to schedule your first exchange!
          </p>
        )}
      </div>

      {/* Book Session Modal */}
      <BookSessionModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        teacher={selectedTeacher}
        preselectedSkills={selectedTeacherSkills}
        onSubmit={handleBookSession}
      />

      {/* Public Profile Modal */}
      <PublicProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        studentId={selectedStudentForProfile?._id || selectedStudentForProfile?.id}
        onRequestSession={(student) => {
          setProfileModalOpen(false);
          handleOpenBooking(student, student?.skillsOffered || []);
        }}
      />
    </div>
  );
};

export default DashboardPage;
