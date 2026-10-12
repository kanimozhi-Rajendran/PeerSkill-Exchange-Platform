import React from 'react';
import { Trash2, Edit3, Award, BookOpen } from 'lucide-react';

const SkillCard = ({ skill, type = 'teachable', onDelete, onEdit }) => {
  const isTeachable = type === 'teachable';

  const proficiencyColors = {
    Beginner: { bg: 'var(--bg-subtle)', text: 'var(--text-secondary)' },
    Intermediate: { bg: 'var(--primary-light)', text: 'var(--primary)' },
    Advanced: { bg: 'var(--success-light)', text: 'var(--success)' }
  };

  const pColor = proficiencyColors[skill.proficiency] || proficiencyColors.Intermediate;

  return (
    <div className="card card-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '0.75rem',
      borderLeft: `4px solid ${isTeachable ? 'var(--primary)' : 'var(--secondary)'}`
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
              {isTeachable ? (
                <Award size={15} color="var(--primary)" />
              ) : (
                <BookOpen size={15} color="var(--secondary)" />
              )}
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: isTeachable ? 'var(--primary)' : 'var(--secondary)'
              }}>
                {isTeachable ? 'I Can Teach' : 'I Want To Learn'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {skill.name}
            </h4>
          </div>

          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: pColor.bg,
            color: pColor.text
          }}>
            {skill.proficiency}
          </span>
        </div>

        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          marginTop: '0.375rem',
          display: 'inline-block',
          backgroundColor: 'var(--bg-subtle)',
          padding: '0.15rem 0.5rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          {skill.category || 'Programming'}
        </div>

        {skill.description && (
          <p style={{
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            marginTop: '0.625rem',
            lineHeight: 1.4
          }}>
            {skill.description}
          </p>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {onEdit && (
          <button
            onClick={() => onEdit(skill)}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.3rem 0.6rem' }}
            title="Edit skill"
          >
            <Edit3 size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(skill.id || skill._id)}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.3rem 0.6rem', color: 'var(--danger)' }}
            title="Remove skill"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
