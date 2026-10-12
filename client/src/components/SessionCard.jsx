import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle, 
  Star, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';

const SessionCard = ({ session, onAccept, onReject, onCancel, onComplete, onReview }) => {
  const {
    _id,
    skillName,
    date,
    time,
    durationMinutes,
    status,
    meetingLink,
    message,
    teacher,
    learner,
    isTeacher,
    isLearner,
    cancellationReason
  } = session;

  const statusClassMap = {
    pending: 'status-pending',
    accepted: 'status-accepted',
    completed: 'status-completed',
    rejected: 'status-rejected',
    cancelled: 'status-cancelled'
  };

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      <div>
        {/* Top Status & Role */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span className={`badge ${statusClassMap[status] || 'badge-neutral'}`} style={{ textTransform: 'capitalize' }}>
            {status}
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: isTeacher ? 'var(--primary)' : 'var(--secondary)',
            backgroundColor: isTeacher ? 'var(--primary-light)' : 'var(--secondary-light)',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            {isTeacher ? 'You are Teaching' : 'You are Learning'}
          </span>
        </div>

        {/* Skill Title */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {skillName}
        </h3>

        {/* Partner Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem'
        }}>
          <User size={15} color="var(--text-muted)" />
          <span>
            {isTeacher ? `Learner: ${learner?.name}` : `Mentor: ${teacher?.name}`}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            ({isTeacher ? learner?.department : teacher?.department})
          </span>
        </div>

        {/* Date, Time, Duration */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.625rem 0.75rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} color="var(--primary)" />
            <span>{date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} color="var(--primary)" />
            <span>{time} ({durationMinutes || 60} mins)</span>
          </div>
        </div>

        {/* Venue / Link */}
        {meetingLink && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem'
          }}>
            <MapPin size={13} />
            <span>Location/Link: <strong>{meetingLink}</strong></span>
          </div>
        )}

        {/* Note / Message */}
        {message && (
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            borderLeft: '2px solid var(--border-light)',
            paddingLeft: '0.5rem',
            marginTop: '0.5rem'
          }}>
            "{message}"
          </p>
        )}

        {/* Cancellation Notice if any */}
        {status === 'cancelled' && cancellationReason && (
          <div style={{
            fontSize: '0.775rem',
            color: 'var(--danger)',
            backgroundColor: 'var(--danger-light)',
            padding: '0.35rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            marginTop: '0.5rem'
          }}>
            Reason: {cancellationReason}
          </div>
        )}
      </div>

      {/* Action Buttons depending on Lifecycle State */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-light)'
      }}>
        {/* Pending Actions for Teacher */}
        {status === 'pending' && isTeacher && (
          <>
            <button
              onClick={() => onReject(_id)}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              <X size={14} /> Decline
            </button>
            <button
              onClick={() => onAccept(_id)}
              className="btn btn-success btn-sm"
            >
              <Check size={14} /> Accept Session
            </button>
          </>
        )}

        {/* Pending Actions for Learner (can cancel) */}
        {status === 'pending' && isLearner && (
          <button
            onClick={() => onCancel(_id)}
            className="btn btn-outline btn-sm"
          >
            Cancel Request
          </button>
        )}

        {/* Accepted Actions (can Complete or Cancel) */}
        {status === 'accepted' && (
          <>
            <button
              onClick={() => onCancel(_id)}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              Cancel
            </button>
            <button
              onClick={() => onComplete(_id)}
              className="btn btn-primary btn-sm"
            >
              <CheckCircle size={14} /> Mark Completed
            </button>
          </>
        )}

        {/* Completed Actions: Review */}
        {status === 'completed' && (
          <button
            onClick={() => onReview(session)}
            className="btn btn-outline btn-sm"
            style={{ color: '#b45309', borderColor: '#fde68a', backgroundColor: '#fffbeb' }}
          >
            <Star size={14} fill="#eab308" color="#eab308" /> Rate & Review
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
