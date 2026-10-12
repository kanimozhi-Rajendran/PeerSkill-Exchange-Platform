import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, EmptyState } from '../components/StatCard';
import { Star, MessageSquare, Award, User, CheckCircle2 } from 'lucide-react';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const userId = user?._id || user?.id;
      if (!userId) return;

      const res = await api.get(`/reviews/student/${userId}`);
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading your peer reviews & ratings..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Reviews & Ratings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Verified feedback from students who completed learning sessions with you.
        </p>
      </div>

      {/* Rating Summary Card */}
      <div className="card" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1
          }}>
            {user?.averageRating || 5.0}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  color="#eab308"
                  fill={s <= Math.round(user?.averageRating || 5) ? '#eab308' : 'none'}
                />
              ))}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Based on <strong>{reviews.length} completed peer reviews</strong>
            </div>
          </div>
        </div>

        <div style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--success-light)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--success-border)',
          fontSize: '0.825rem',
          color: 'var(--success)',
          fontWeight: 600
        }}>
          ✅ Verified Peer Exchanges • No duplicate reviews allowed
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
          Recent Peer Testimonials ({reviews.length})
        </h3>

        {reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((r, idx) => {
              const dateStr = new Date(r.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        {r.reviewerName ? r.reviewerName.charAt(0) : 'S'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {r.reviewerName || 'Student Peer'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Session on <strong>{r.skillName}</strong> • {dateStr}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} color="#eab308" fill="#eab308" />
                      ))}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    "{r.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No Reviews Received Yet"
            description="Complete scheduled sessions with peers to receive verified ratings and testimonials!"
          />
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
