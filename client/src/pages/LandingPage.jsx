import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Users, 
  Coins, 
  GraduationCap,
  CalendarCheck,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Quick login helper for demo review
  const handleQuickDemo = async (email, password) => {
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)',
        padding: '4rem 1.25rem 3rem 1.25rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.875rem',
            backgroundColor: '#ffffff',
            border: '1px solid #c7d2fe',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={16} /> Academic Peer-to-Peer Skill Barter Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: 'var(--text-primary)'
          }}>
            Exchange Skills With College Peers,{' '}
            <span className="text-gradient">Zero Money Required.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '720px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Teach what you know, learn what you need. Our rules-based matching engine pairs college students for two-way mutual skill exchanges and verified learning sessions.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Student Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Join PeerSkill Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In to Account
                </Link>
              </>
            )}
          </div>

          {/* Quick Demo Accounts Banner for Viva Review */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap size={18} color="#d97706" />
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                College Viva Demonstration: One-Click Demo Profiles
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => handleQuickDemo('priya@peerskill.edu', 'Password@123')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '0.5rem 0.75rem' }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>👤 Priya Sharma (CS, 3rd Yr)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Teaches Python • Wants Excel</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickDemo('rahul@peerskill.edu', 'Password@123')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '0.5rem 0.75rem' }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--secondary-hover)' }}>👤 Rahul Verma (DS, 3rd Yr)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Teaches Excel • Wants Python (Mutual Match!)</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickDemo('admin@peerskill.edu', 'Admin@123')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '0.5rem 0.75rem' }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--danger)' }}>🛡️ Platform Administrator</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Full Governance & Moderation</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: The 2-Way Match Example */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            How The Two-Way Match Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Traditional tutoring costs money students don't have. PeerSkill solves this through direct barter reciprocity.
          </p>
        </div>

        <div className="grid-3">
          <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>1</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              List Your Skills
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Student A lists <strong>Python</strong> (Teachable) and <strong>Excel</strong> (Wanted). Student B lists <strong>Excel</strong> (Teachable) and <strong>Python</strong> (Wanted).
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--secondary-light)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>2</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Algorithm Identifies Mutual Fit
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Our matching algorithm detects the synergy, calculates a <strong>95% Synergy Score</strong>, and provides an explainable match breakdown.
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>3</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Book & Earn Skill Credits
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Both students schedule sessions. On completion, the teacher receives <strong>+5 skill credits</strong> and mutual 5-star peer reviews!
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Engineered For Academic Excellence
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Built using strict Software Engineering (SEPM) and Web Development (WAD) standards.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <Coins size={28} color="#d97706" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Skill Credit Barter Economy
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Prevents exploitation. Every student begins with 10 welcome credits. Teaching sessions rewards credits, preventing free-riders.
            </p>
          </div>

          <div className="card">
            <Sparkles size={28} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Deterministic Matching Algorithm
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Calculates real scores based on mutual synergy, proficiency weights (Beginner, Intermediate, Advanced), and category filters.
            </p>
          </div>

          <div className="card">
            <CalendarCheck size={28} color="var(--secondary)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Safe Session Booking
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enforces state transitions (Pending → Accepted → Completed). Strictly blocks past-date bookings and non-participant mutations.
            </p>
          </div>

          <div className="card">
            <Star size={28} color="#eab308" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Verified Peer Ratings & Reviews
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Only students who completed a verified session can leave feedback. Enforces 1 review per session to maintain rating integrity.
            </p>
          </div>

          <div className="card">
            <ShieldCheck size={28} color="var(--danger)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Role-Based Governance (Admin)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Campus administrators can monitor platform activity, audit session logs, and moderate or suspend accounts if necessary.
            </p>
          </div>

          <div className="card">
            <Zap size={28} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Fault-Tolerant Persistence
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Dual-engine architecture connects to MongoDB or auto-activates persistent local storage for zero-config college demonstration.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
            Ready to Accelerate Your College Learning?
          </h2>
          <p style={{ fontSize: '1rem', color: '#c7d2fe', maxWidth: '580px', margin: '0 auto 2rem auto' }}>
            Join Priya, Rahul, and fellow college peers. Register today, get 10 free skill credits, and trade your first skill!
          </p>
          <Link to="/register" className="btn btn-secondary btn-lg" style={{ color: '#ffffff', fontWeight: 700 }}>
            Create Your Student Profile <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
