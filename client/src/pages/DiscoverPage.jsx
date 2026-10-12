import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookSessionModal from '../components/BookSessionModal';
import PublicProfileModal from '../components/PublicProfileModal';
import { LoadingSpinner, EmptyState } from '../components/StatCard';
import { 
  Compass, 
  Search, 
  Star, 
  Award, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  User,
  ArrowRight,
  Eye,
  CheckCircle,
  Filter
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Computer Science & Engineering',
  'Information Technology',
  'Data Science & Analytics',
  'Artificial Intelligence & ML',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Business Administration'
];

const CATEGORIES = [
  'All',
  'Programming',
  'Data Science',
  'Design',
  'Languages',
  'Engineering',
  'Academics',
  'Music & Arts',
  'Other'
];

const PROFICIENCIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const DiscoverPage = () => {
  const { user, showToast } = useAuth();
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('All');
  const [category, setCategory] = useState('All');
  const [proficiency, setProficiency] = useState('All');
  const [matchesWanted, setMatchesWanted] = useState(false);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (department !== 'All') params.department = department;
      if (category !== 'All') params.category = category;
      if (proficiency !== 'All') params.proficiency = proficiency;
      if (matchesWanted) params.matchesWanted = 'true';

      const res = await api.get('/matches/discover', { params });
      if (res.data.success) {
        setStudents(res.data.students || []);
        setTotalCount(res.data.totalCount || (res.data.students || []).length);
      }
    } catch (err) {
      console.error('Discover error:', err);
      showToast('Failed to load student directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department, category, proficiency, matchesWanted]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleOpenBooking = (student) => {
    setSelectedStudent(student);
    setBookingModalOpen(true);
  };

  const handleOpenProfile = (student) => {
    setSelectedStudent(student);
    setProfileModalOpen(true);
  };

  const handleBookSession = async (bookingData) => {
    try {
      const res = await api.post('/sessions', bookingData);
      if (res.data.success) {
        showToast('Session request sent to peer mentor!', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to book session.', 'error');
      return false;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartment('All');
    setCategory('All');
    setProficiency('All');
    setMatchesWanted(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Discover Peer Mentors</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Browse fellow college students across departments, view what skills they offer, inspect their public profiles, and schedule exchange sessions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
            marginBottom: '1rem'
          }}>
            <div>
              <label className="form-label">Search Student or Skill</label>
              <input
                type="text"
                className="form-input"
                placeholder="Name, skill, branch, college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Department / Branch</label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {DEPARTMENTS.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Skill Category</label>
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
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            {/* Quick Filter: Matches Wanted Skills */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={matchesWanted}
                onChange={(e) => setMatchesWanted(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <span>🎯 Show only peers teaching skills I want to learn</span>
            </label>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                <Search size={14} /> Filter ({totalCount})
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline btn-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Searching student directory..." />
      ) : students.length > 0 ? (
        <div className="grid-2">
          {students.map((student) => {
            const teachSkills = student.skillsTeachable || [];
            const wantSkills = student.skillsWanted || [];

            return (
              <div key={student._id} className="card card-interactive" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div>
                  {/* Student Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
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
                          student.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{student.name}</h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {student.department} • {student.yearOfStudy}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          🏫 {student.college || 'College of Engineering & Technology'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Star size={15} color="#eab308" fill="#eab308" />
                      <span>{student.averageRating || 5.0}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({student.reviewCount || 0})</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {student.bio && (
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      margin: '0.75rem 0',
                      fontStyle: 'italic',
                      lineHeight: 1.4
                    }}>
                      "{student.bio}"
                    </p>
                  )}

                  {/* Teachable Skills */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                      Can Teach:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {teachSkills.length > 0 ? (
                        teachSkills.map((s, idx) => (
                          <span key={idx} className="badge badge-primary">
                            <Award size={11} /> {s.name} ({s.proficiency})
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No skills listed yet</span>
                      )}
                    </div>
                  </div>

                  {/* Wanted Skills */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                      Wants to Learn:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {wantSkills.length > 0 ? (
                        wantSkills.map((s, idx) => (
                          <span key={idx} className="badge badge-neutral">
                            <BookOpen size={11} /> {s.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open to all skills</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div style={{
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => handleOpenProfile(student)}
                    className="btn btn-outline btn-sm"
                    title="View public profile details, ratings, and stats"
                  >
                    <Eye size={14} /> View Profile
                  </button>

                  <button
                    onClick={() => handleOpenBooking(student)}
                    className="btn btn-primary btn-sm"
                    disabled={teachSkills.length === 0}
                  >
                    <Calendar size={14} /> Request Session <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Students Matched Your Filter"
          description="Try resetting your category or proficiency filters, or search for another keyword. If you are starting fresh, you can also share your link with classmates!"
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Public Profile Modal */}
      <PublicProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        student={selectedStudent}
        onRequestSession={(student) => handleOpenBooking(student)}
      />

      {/* Booking Modal */}
      <BookSessionModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        teacher={selectedStudent}
        onSubmit={handleBookSession}
      />
    </div>
  );
};

export default DiscoverPage;
