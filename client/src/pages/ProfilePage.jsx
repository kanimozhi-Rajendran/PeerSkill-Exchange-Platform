import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Coins, 
  Star, 
  Edit3, 
  X, 
  Check, 
  Award, 
  BookOpen,
  Building,
  Clock,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Data Science & Analytics',
  'Artificial Intelligence & ML',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Business Administration',
  'Mathematics & Humanities'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

const ProfilePage = () => {
  const { user, updateProfile, showToast } = useAuth();
  const [imgError, setImgError] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || 'University Engineering Campus',
    department: user?.department || 'Computer Science & Engineering',
    yearOfStudy: user?.yearOfStudy || '3rd Year',
    picture: user?.picture || '',
    bio: user?.bio || '',
    interestsString: (user?.interests || []).join(', ')
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || '',
      college: user?.college || 'University Engineering Campus',
      department: user?.department || 'Computer Science & Engineering',
      yearOfStudy: user?.yearOfStudy || '3rd Year',
      picture: user?.picture || '',
      bio: user?.bio || '',
      interestsString: (user?.interests || []).join(', ')
    });
    setImgError(false);
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const interests = formData.interestsString
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const res = await updateProfile({
      name: formData.name,
      college: formData.college,
      department: formData.department,
      yearOfStudy: formData.yearOfStudy,
      picture: formData.picture,
      bio: formData.bio,
      interests
    });

    setSubmitting(false);
    if (res.success) {
      setImgError(false);
      setEditModalOpen(false);
    }
  };

  const teachSkills = user?.skillsTeachable || [];
  const wantSkills = user?.skillsWanted || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Overview Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {user?.picture && !imgError ? (
              <img
                src={user.picture}
                alt={user.name}
                onError={() => setImgError(true)}
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
            ) : (
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-md)'
              }}>
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  Student Member
                </span>
                {user?.googleId && (
                  <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem' }}>
                    Google Verified
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user?.name}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={15} color="var(--primary)" />
                  {user?.college || 'University Engineering Campus'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <GraduationCap size={15} color="var(--primary)" />
                  {user?.department} ({user?.yearOfStudy})
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={15} color="var(--text-muted)" />
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          <button onClick={handleOpenEdit} className="btn btn-outline btn-sm">
            <Edit3 size={15} /> Edit Profile
          </button>
        </div>

        {/* Bio */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            About Me
          </h4>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {user?.bio || 'No bio written yet. Click "Edit Profile" to share your background!'}
          </p>
        </div>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Interests & Focus Areas
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {user.interests.map((interest, idx) => (
                <span key={idx} className="badge badge-primary">
                  #{interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins size={22} color="#d97706" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user?.credits ?? 10} 🪙</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Credit Balance</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={22} color="#eab308" fill="#eab308" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user?.averageRating || 5.0} / 5.0</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({user?.reviewCount || 0} reviews)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={22} color="var(--success)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user?.totalSessionsCompleted || 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Sessions</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={22} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user?.totalHoursTaught || 0}h / {user?.totalHoursLearned || 0}h</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taught / Learned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Showcase Grid */}
      <div className="grid-2">
        {/* Teachable */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Award size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Skills I Can Teach ({teachSkills.length})</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {teachSkills.length > 0 ? (
              teachSkills.map((s, idx) => (
                <span key={idx} className="badge badge-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  {s.name} ({s.proficiency})
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Wanted */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BookOpen size={20} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Skills I Want to Learn ({wantSkills.length})</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {wantSkills.length > 0 ? (
              wantSkills.map((s, idx) => (
                <span key={idx} className="badge badge-neutral" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  {s.name} ({s.proficiency})
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills listed yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Profile</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Stanford University, MIT, IIT Madras"
                />
              </div>

              <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    {DEPARTMENTS.map((d, idx) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Year of Study</label>
                  <select
                    className="form-select"
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  >
                    {YEARS.map((y, idx) => (
                      <option key={idx} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Profile Picture URL (Avatar)</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.picture}
                  onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                  placeholder="https://images.unsplash.com/... or Google avatar link"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-textarea"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell peers what you are enthusiastic about..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interests (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.interestsString}
                  onChange={(e) => setFormData({ ...formData, interestsString: e.target.value })}
                  placeholder="e.g. Full Stack, AI, Robotics, Music"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
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
                  <Check size={16} /> {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
