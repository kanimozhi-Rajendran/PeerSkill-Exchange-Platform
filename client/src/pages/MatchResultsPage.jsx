import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MatchCard from '../components/MatchCard';
import BookSessionModal from '../components/BookSessionModal';
import PublicProfileModal from '../components/PublicProfileModal';
import { LoadingSpinner, EmptyState } from '../components/StatCard';
import { GitCompare, Search, Filter, Sparkles, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  'All', 'Programming', 'Data Science', 'Design', 'Languages', 'Engineering', 'Academics', 'Music & Arts'
];

const PROFICIENCIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const MatchResultsPage = () => {
  const { showToast } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [skillSearch, setSkillSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [proficiency, setProficiency] = useState('All');

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Public Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);

  const handleOpenProfile = (student) => {
    setSelectedStudentForProfile(student);
    setProfileModalOpen(true);
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const params = {};
      if (skillSearch.trim()) params.skill = skillSearch.trim();
      if (category !== 'All') params.category = category;
      if (proficiency !== 'All') params.proficiency = proficiency;

      const res = await api.get('/matches', { params });
      if (res.data.success) {
        setMatches(res.data.matches || []);
      }
    } catch (err) {
      console.error('Fetch matches error:', err);
      showToast('Failed to calculate skill matches.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [category, proficiency]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMatches();
  };

  const handleOpenBooking = (student, skills) => {
    setSelectedTeacher(student);
    setSelectedSkills(skills || []);
    setBookingModalOpen(true);
  };

  const handleBookSession = async (bookingData) => {
    try {
      const res = await api.post('/sessions', bookingData);
      if (res.data.success) {
        showToast('Session booked! Sent request to peer mentor.', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to book session.', 'error');
      return false;
    }
  };

  const mutualCount = matches.filter(m => m.matchType === 'mutual').length;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">
              <Sparkles size={12} /> Rules-Based Matching Engine
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Skill Matching Results</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Found <strong>{matches.length} matching peers</strong> ({mutualCount} perfect 2-way barter pairs)
          </p>
        </div>

        <button onClick={fetchMatches} className="btn btn-outline btn-sm">
          <RefreshCw size={14} /> Refresh Engine
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          <div>
            <label className="form-label">Search Skill</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Python, Excel, Figma..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Proficiency Level</label>
            <select
              className="form-select"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
            >
              {PROFICIENCIES.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Search size={15} /> Filter
            </button>
            <button
              type="button"
              onClick={() => {
                setSkillSearch('');
                setCategory('All');
                setProficiency('All');
              }}
              className="btn btn-outline"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      {loading ? (
        <LoadingSpinner text="Computing deterministic skill matches..." />
      ) : matches.length > 0 ? (
        <div className="grid-2">
          {matches.map((m, idx) => (
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
          title="No Direct Matches Found"
          description="None of your wanted skills currently cross-match with other students' teachable skills under these filter settings. Add more skills to broaden opportunities!"
          actionText="Manage My Skills"
          onAction={() => window.location.href = '/skills'}
        />
      )}

      {/* Booking Modal */}
      <BookSessionModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        teacher={selectedTeacher}
        preselectedSkills={selectedSkills}
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

export default MatchResultsPage;
