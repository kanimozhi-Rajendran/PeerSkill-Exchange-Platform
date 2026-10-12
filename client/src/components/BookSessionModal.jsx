import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Send } from 'lucide-react';

const BookSessionModal = ({ isOpen, onClose, teacher, preselectedSkills = [], onSubmit }) => {
  if (!isOpen || !teacher) return null;

  // Available skills the teacher offers
  const availableSkills = (teacher.skillsTeachable && teacher.skillsTeachable.length > 0)
    ? teacher.skillsTeachable
    : preselectedSkills;

  const defaultSkill = availableSkills.length > 0 ? availableSkills[0].name : '';

  // Today in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const [skillName, setSkillName] = useState(defaultSkill);
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('16:00');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [message, setMessage] = useState('');
  const [meetingLink, setMeetingLink] = useState('College Library / Google Meet');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName) {
      setError('Please select a skill to learn.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }
    if (new Date(date) < new Date(todayStr)) {
      setError('Session date cannot be in the past.');
      return;
    }

    setError('');
    setSubmitting(true);

    const success = await onSubmit({
      teacherId: teacher._id || teacher.id,
      skillName,
      date,
      time,
      durationMinutes: Number(durationMinutes),
      message,
      meetingLink
    });

    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Book Learning Session
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Requesting a peer session with <strong>{teacher.name}</strong> ({teacher.department})
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '0.625rem 0.75rem',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Skill Selection */}
          <div className="form-group">
            <label className="form-label">Skill to Learn</label>
            {availableSkills.length > 0 ? (
              <select
                className="form-select"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              >
                {availableSkills.map((s, idx) => (
                  <option key={idx} value={s.name}>
                    {s.name} ({s.proficiency}) - {s.category}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Python Fundamentals"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            )}
          </div>

          {/* Date & Time Grid */}
          <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Session Date</label>
              <input
                type="date"
                className="form-input"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Preferred Time</label>
              <input
                type="time"
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration & Location */}
          <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Duration</label>
              <select
                className="form-select"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes (1 Hour)</option>
                <option value="90">90 minutes (1.5 Hours)</option>
                <option value="120">120 minutes (2 Hours)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Location / Link</label>
              <input
                type="text"
                className="form-input"
                placeholder="Google Meet or Campus Study Room"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          </div>

          {/* Message */}
          <div className="form-group">
            <label className="form-label">Notes or Topics to Cover (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Tell your peer mentor what specific concepts, exercises, or doubts you want to work through..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Notice */}
          <div style={{
            padding: '0.625rem 0.75rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem'
          }}>
            💡 Zero cash required! Once completed, your mentor automatically receives <strong>+5 skill credits</strong> as an academic incentive.
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Send size={15} /> {submitting ? 'Sending Request...' : 'Send Session Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookSessionModal;
