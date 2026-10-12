import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillCard from '../components/SkillCard';
import { EmptyState } from '../components/StatCard';
import { Award, BookOpen, Plus, X, Check } from 'lucide-react';

const CATEGORIES = [
  'Programming', 'Data Science', 'Design', 'Languages', 'Engineering', 'Academics', 'Music & Arts', 'Other'
];

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced'];

const SkillsPage = () => {
  const { user, refreshUser, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('teachable'); // 'teachable' | 'wanted'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    proficiency: 'Intermediate',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const teachableSkills = user?.skillsTeachable || [];
  const wantedSkills = user?.skillsWanted || [];

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Programming',
      proficiency: 'Intermediate',
      description: ''
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category || 'Programming',
      proficiency: skill.proficiency || 'Intermediate',
      description: skill.description || ''
    });
    setError('');
    setModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter a skill name.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingSkill) {
        // Update existing skill
        const sId = editingSkill.id || editingSkill._id;
        const res = await api.put(`/skills/${sId}`, {
          type: activeTab,
          ...formData
        });
        if (res.data.success) {
          showToast(`Skill "${formData.name}" updated successfully!`, 'success');
          await refreshUser();
          setModalOpen(false);
        }
      } else {
        // Add new skill
        const res = await api.post('/skills', {
          type: activeTab,
          ...formData
        });
        if (res.data.success) {
          showToast(`Skill "${formData.name}" added successfully!`, 'success');
          await refreshUser();
          setModalOpen(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;

    try {
      const res = await api.delete(`/skills/${skillId}?type=${activeTab}`);
      if (res.data.success) {
        showToast('Skill removed successfully.', 'info');
        await refreshUser();
      }
    } catch (err) {
      showToast('Failed to remove skill.', 'error');
    }
  };

  const currentList = activeTab === 'teachable' ? teachableSkills : wantedSkills;

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Your Skills</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Specify what you can teach other students and what skills you want to learn in exchange.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} /> Add {activeTab === 'teachable' ? 'Teachable' : 'Wanted'} Skill
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('teachable')}
          className={`tab-btn ${activeTab === 'teachable' ? 'active' : ''}`}
        >
          <Award size={16} style={{ display: 'inline', marginRight: '0.35rem' }} />
          Skills I Can Teach ({teachableSkills.length})
        </button>

        <button
          onClick={() => setActiveTab('wanted')}
          className={`tab-btn ${activeTab === 'wanted' ? 'active' : ''}`}
        >
          <BookOpen size={16} style={{ display: 'inline', marginRight: '0.35rem' }} />
          Skills I Want to Learn ({wantedSkills.length})
        </button>
      </div>

      {/* Info Callout */}
      <div style={{
        padding: '0.875rem 1.25rem',
        backgroundColor: activeTab === 'teachable' ? 'var(--primary-light)' : 'var(--secondary-light)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${activeTab === 'teachable' ? '#c7d2fe' : '#a5f3fc'}`,
        fontSize: '0.85rem',
        color: activeTab === 'teachable' ? 'var(--primary)' : 'var(--secondary-hover)'
      }}>
        {activeTab === 'teachable' ? (
          <>
            🌟 <strong>Teachable Skills:</strong> Other students will be able to book 1-on-1 sessions with you for these skills. You will earn <strong>+5 credits</strong> for each completed session!
          </>
        ) : (
          <>
            🎯 <strong>Wanted Skills:</strong> The system automatically searches for students who teach these topics to find mutual two-way exchanges and mentors.
          </>
        )}
      </div>

      {/* Skills Grid */}
      {currentList.length > 0 ? (
        <div className="grid-3">
          {currentList.map((skill, idx) => (
            <SkillCard
              key={skill.id || skill._id || idx}
              skill={skill}
              type={activeTab}
              onDelete={handleDeleteSkill}
              onEdit={openEditModal}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={activeTab === 'teachable' ? Award : BookOpen}
          title={activeTab === 'teachable' ? 'No Teachable Skills Listed' : 'No Wanted Skills Listed'}
          description={
            activeTab === 'teachable'
              ? 'List skills you excel in (e.g. Python, Figma, Excel, Calculus) so peers can learn from you.'
              : 'Add skills you wish to learn so our matching algorithm can find the best peer mentors for you.'
          }
          actionText={`Add First ${activeTab === 'teachable' ? 'Teachable' : 'Wanted'} Skill`}
          onAction={openAddModal}
        />
      )}

      {/* Add / Edit Skill Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingSkill ? 'Edit Skill' : `Add ${activeTab === 'teachable' ? 'Teachable' : 'Wanted'} Skill`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
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

            <form onSubmit={handleSaveSkill}>
              <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React.js, Machine Learning, UI/UX"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                  >
                    {PROFICIENCIES.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Topics Covered</label>
                <textarea
                  className="form-textarea"
                  placeholder="Summarize key topics or syllabus you can teach or want to understand..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
                  <Check size={16} /> {submitting ? 'Saving...' : editingSkill ? 'Update Skill' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
