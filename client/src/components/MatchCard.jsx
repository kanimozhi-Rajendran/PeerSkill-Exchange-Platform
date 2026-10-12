import React from 'react';
import { Sparkles, Calendar, Star, ArrowRight, CheckCircle, GraduationCap, Eye } from 'lucide-react';

const MatchCard = ({ match, onBookSession, onViewProfile }) => {
  const { student, matchType, score, explanation, skillsTheyTeachYouWant, skillsYouTeachTheyWant } = match;
  const isMutual = matchType === 'mutual';

  return (
    <div className="card card-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem',
      position: 'relative',
      border: isMutual ? '2px solid #818cf8' : '1px solid var(--border-light)',
      boxShadow: isMutual ? '0 8px 20px -4px rgba(99, 102, 241, 0.15)' : 'var(--shadow-sm)'
    }}>
      {/* Mutual Match Banner */}
      {isMutual && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '1.25rem',
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          fontSize: '0.725rem',
          fontWeight: 800,
          padding: '0.2rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)'
        }}>
          <Sparkles size={13} /> 2-WAY MUTUAL EXCHANGE
        </div>
      )}

      <div>
        {/* Header: Student Info & Match Score */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: isMutual ? '0.5rem' : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: isMutual ? 'var(--primary)' : 'var(--secondary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              fontWeight: 800,
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {student.picture ? (
                <img 
                  src={student.picture} 
                  alt={student.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                student.name.charAt(0)
              )}
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {student.name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{student.department}</span>
                <span>•</span>
                <span>{student.yearOfStudy}</span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: isMutual ? 'var(--primary-light)' : 'var(--success-light)',
            color: isMutual ? 'var(--primary)' : 'var(--success)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${isMutual ? '#c7d2fe' : 'var(--success-border)'}`
          }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1 }}>
              {score}%
            </span>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Match Score
            </span>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            margin: '0.75rem 0',
            fontStyle: 'italic'
          }}>
            "{student.bio}"
          </p>
        )}

        {/* Skill Exchange Synergy Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.625rem',
          margin: '0.875rem 0'
        }}>
          {/* What they can teach you */}
          <div style={{
            padding: '0.625rem 0.75rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              THEY CAN TEACH YOU:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {skillsTheyTeachYouWant && skillsTheyTeachYouWant.length > 0 ? (
                skillsTheyTeachYouWant.map((s, idx) => (
                  <span key={idx} className="badge badge-primary">
                    <CheckCircle size={12} /> {s.name} ({s.proficiency})
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Explore their profile for other skills
                </span>
              )}
            </div>
          </div>

          {/* What you can teach them */}
          {isMutual && (
            <div style={{
              padding: '0.625rem 0.75rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                YOU CAN TEACH THEM:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {skillsYouTeachTheyWant.map((s, idx) => (
                  <span key={idx} className="badge badge-success">
                    <CheckCircle size={12} /> {s.name} ({s.proficiency})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Human-Readable Match Explanation Box */}
        <div style={{
          padding: '0.625rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isMutual ? '#faf5ff' : 'var(--bg-subtle)',
          border: `1px solid ${isMutual ? '#e9d5ff' : 'var(--border-light)'}`,
          fontSize: '0.775rem',
          color: isMutual ? '#6b21a8' : 'var(--text-secondary)',
          lineHeight: 1.45
        }}>
          {explanation}
        </div>
      </div>

      {/* Footer: Rating & Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <Star size={15} color="#eab308" fill="#eab308" />
          <span>{student.averageRating || 5.0}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ({student.reviewCount || 0} reviews)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onViewProfile && (
            <button
              onClick={() => onViewProfile(student)}
              className="btn btn-outline btn-sm"
              title="View student public profile"
            >
              <Eye size={14} /> Profile
            </button>
          )}

          <button
            onClick={() => onBookSession(student, skillsTheyTeachYouWant)}
            className={`btn ${isMutual ? 'btn-primary' : 'btn-outline'} btn-sm`}
          >
            <Calendar size={14} /> Book <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
