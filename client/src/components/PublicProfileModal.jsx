import React from 'react';
import { 
  X, 
  GraduationCap, 
  Star, 
  Award, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  School
} from 'lucide-react';

const PublicProfileModal = ({ isOpen, onClose, student, onRequestSession }) => {
  if (!isOpen || !student) return null;

  const teachSkills = student.skillsTeachable || [];
  const wantSkills = student.skillsWanted || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden'
            }}>
              {student.picture ? (
                <img 
                  src={student.picture} 
                  alt={student.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                student.name ? student.name.charAt(0).toUpperCase() : 'S'
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {student.name}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <GraduationCap size={14} color="var(--primary)" />
                  {student.department} • {student.yearOfStudy}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                🏫 {student.college || 'College of Engineering & Technology'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Reputation & Performance Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          padding: '0.875rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 800, fontSize: '1.1rem' }}>
              <Star size={16} fill="#eab308" color="#eab308" />
              <span>{student.averageRating || 5.0}</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {student.reviewCount || 0} Peer Reviews
            </span>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
              {student.totalSessionsCompleted || 0}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Sessions Done
            </span>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>
              {student.totalHoursTaught || 0} hrs
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Hours Taught
            </span>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              About
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
              "{student.bio}"
            </p>
          </div>
        )}

        {/* Interests */}
        {student.interests && student.interests.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Interests & Focus
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {student.interests.map((int, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  #{int}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills Offered (Teachable) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
            <Award size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Skills Offered ({teachSkills.length})
            </h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {teachSkills.length > 0 ? (
              teachSkills.map((s, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '0.4rem 0.75rem',
                    backgroundColor: 'var(--primary-light)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #c7d2fe',
                    fontSize: '0.8rem',
                    color: 'var(--primary)'
                  }}
                >
                  <strong style={{ display: 'block' }}>{s.name}</strong>
                  <span style={{ fontSize: '0.675rem', opacity: 0.85 }}>{s.proficiency} • {s.category}</span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Skills Wanted (Learning Goals) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
            <BookOpen size={16} color="var(--secondary)" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Skills Wanted to Learn ({wantSkills.length})
            </h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {wantSkills.length > 0 ? (
              wantSkills.map((s, idx) => (
                <span key={idx} className="badge badge-neutral" style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}>
                  {s.name} ({s.proficiency})
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open to all skills</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onRequestSession) onRequestSession(student);
            }}
            className="btn btn-primary"
            disabled={teachSkills.length === 0}
          >
            <Calendar size={15} /> Request Session <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileModal;
