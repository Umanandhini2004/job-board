import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, authAPI } from '../services/api';

const CandidateDashboard = () => {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    phone: user?.phone || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    setProfileForm({
      phone: user?.phone || '',
      skills: user?.skills?.join(', ') || '',
      experience: user?.experience || '',
    });
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        phone: profileForm.phone,
        skills: profileForm.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        experience: profileForm.experience,
      };
      const response = await authAPI.updateProfile(payload);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'status-applied';
      case 'Shortlisted':
        return 'status-shortlisted';
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <div className="candidate-dashboard">
      <h1>Candidate Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      <div className="dashboard-section">
        <div className="profile-info">
          <h3>Profile Information</h3>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                name="skills"
                value={profileForm.skills}
                onChange={handleProfileChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div className="form-group">
              <label>Experience</label>
              <input
                type="text"
                name="experience"
                value={profileForm.experience}
                onChange={handleProfileChange}
                placeholder="2 years"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Applications</h2>
        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length > 0 ? (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app._id} className="application-card">
                <div className="app-header">
                  <h4>{app.job?.title}</h4>
                  <span className={`status-badge ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <p className="company">{app.job?.location}</p>
                <p className="date">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No applications yet. Start applying to jobs!</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
