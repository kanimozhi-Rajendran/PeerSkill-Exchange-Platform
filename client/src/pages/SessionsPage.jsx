import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';
import ReviewModal from '../components/ReviewModal';
import { LoadingSpinner, EmptyState } from '../components/StatCard';
import { CalendarCheck, Inbox, Send, CheckCircle2, History, RefreshCw } from 'lucide-react';

const SessionsPage = () => {
  const { showToast, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'incoming' | 'outgoing' | 'upcoming' | 'history'
  const [sessionsData, setSessionsData] = useState({
    incoming: [],
    outgoing: [],
    accepted: [],
    completed: [],
    history: []
  });
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sessions');
      if (res.data.success) {
        setSessionsData({
          incoming: res.data.incoming || [],
          outgoing: res.data.outgoing || [],
          accepted: res.data.accepted || [],
          completed: res.data.completed || [],
          history: res.data.history || []
        });
      }
    } catch (err) {
      console.error('Fetch sessions error:', err);
      showToast('Failed to load sessions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleAccept = async (sessionId) => {
    try {
      const res = await api.put(`/sessions/${sessionId}/accept`);
      if (res.data.success) {
        showToast('Session accepted! It is now scheduled in your upcoming calendar.', 'success');
        fetchSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to accept session.', 'error');
    }
  };

  const handleReject = async (sessionId) => {
    const reason = prompt('Please provide a brief reason for declining (optional):', 'Schedule conflict');
    try {
      const res = await api.put(`/sessions/${sessionId}/reject`, { reason });
      if (res.data.success) {
        showToast('Session request declined.', 'info');
        fetchSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to decline session.', 'error');
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    const reason = prompt('Cancellation reason:', 'Schedule conflict');
    try {
      const res = await api.put(`/sessions/${sessionId}/cancel`, { reason });
      if (res.data.success) {
        showToast('Session cancelled.', 'info');
        fetchSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel session.', 'error');
    }
  };

  const handleComplete = async (sessionId) => {
    if (!window.confirm('Confirm that this learning session was conducted? Teacher will receive +5 skill credits.')) return;
    try {
      const res = await api.put(`/sessions/${sessionId}/complete`);
      if (res.data.success) {
        showToast('Session completed! +5 Credits awarded to teacher. 🎉', 'success');
        await refreshUser();
        fetchSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete session.', 'error');
    }
  };

  const handleOpenReview = (session) => {
    setSelectedSessionForReview(session);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const res = await api.post('/reviews', reviewData);
      if (res.data.success) {
        showToast('Review submitted! Thank you for supporting peer quality.', 'success');
        fetchSessions();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
      return false;
    }
  };

  const getListForTab = () => {
    switch (activeTab) {
      case 'incoming': return sessionsData.incoming;
      case 'outgoing': return sessionsData.outgoing;
      case 'upcoming': return sessionsData.accepted;
      case 'history': return sessionsData.history;
      default: return [];
    }
  };

  const currentList = getListForTab();

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Learning Sessions</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Track incoming requests, accepted schedules, session completions, and peer reviews.
          </p>
        </div>

        <button onClick={fetchSessions} className="btn btn-outline btn-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
        >
          <CalendarCheck size={16} style={{ display: 'inline', marginRight: '0.35rem' }} />
          Upcoming Scheduled ({sessionsData.accepted.length})
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`tab-btn ${activeTab === 'incoming' ? 'active' : ''}`}
        >
          <Inbox size={16} style={{ display: 'inline', marginRight: '0.35rem' }} />
          Incoming Requests ({sessionsData.incoming.length})
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`tab-btn ${activeTab === 'outgoing' ? 'active' : ''}`}
        >
          <Send size={16} style={{ display: 'inline', marginRight: '0.35rem' }} />
          Outgoing Requests ({sessionsData.outgoing.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
        >
          <History size={16} style={{ display: 'inline', marginRight: '0.35rem' }} />
          History & Reviews ({sessionsData.history.length})
        </button>
      </div>

      {/* Session Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Loading sessions..." />
      ) : currentList.length > 0 ? (
        <div className="grid-2">
          {currentList.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onReview={handleOpenReview}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title={
            activeTab === 'incoming' ? 'No Pending Incoming Requests' :
            activeTab === 'outgoing' ? 'No Outgoing Requests Sent' :
            activeTab === 'upcoming' ? 'No Upcoming Sessions Scheduled' :
            'No Past Session History'
          }
          description={
            activeTab === 'upcoming'
              ? 'Find peers in Match Finder or Discover Directory to schedule your first exchange.'
              : 'Sessions in this status will appear here automatically.'
          }
          actionText={activeTab === 'upcoming' ? 'Find Matches Now' : undefined}
          onAction={activeTab === 'upcoming' ? () => window.location.href = '/matches' : undefined}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        session={selectedSessionForReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default SessionsPage;
