import React, { useState } from 'react';
import { X, Star, MessageSquare, Send } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, session, onSubmit }) => {
  if (!isOpen || !session) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 3) {
      setError('Please provide at least 3 characters of constructive feedback.');
      return;
    }

    setError('');
    setSubmitting(true);

    const success = await onSubmit({
      sessionId: session._id,
      rating,
      comment: comment.trim()
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
              Leave Peer Feedback
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Session: <strong>{session.skillName}</strong>
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
          {/* Star Rating Picker */}
          <div style={{ textAlign: 'center', margin: '1rem 0 1.5rem 0' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              How would you rate this learning exchange?
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform var(--transition-fast)'
                  }}
                >
                  <Star
                    size={32}
                    color="#eab308"
                    fill={(hoverRating || rating) >= star ? '#eab308' : 'none'}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              {rating === 5 && 'Outstanding! Highly skilled & helpful mentor'}
              {rating === 4 && 'Very Good! Clear explanations'}
              {rating === 3 && 'Average! Learned basics'}
              {rating === 2 && 'Needs improvement'}
              {rating === 1 && 'Unsatisfactory'}
            </span>
          </div>

          {/* Feedback Comment */}
          <div className="form-group">
            <label className="form-label">Review Comment</label>
            <textarea
              className="form-textarea"
              placeholder="Describe your learning experience, what you built, and how well your peer communicated..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
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
              <Send size={15} /> {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
