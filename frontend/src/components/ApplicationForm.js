import React, { useState } from 'react';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplicationForm = ({ jobId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    resume: '',
    cvText: '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await applicationsAPI.applyForJob({
        jobId,
        ...formData,
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/candidate-dashboard';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="success-message">Application submitted successfully!</div>;
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <h3>Apply for this Job</h3>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label>Resume URL or File Path</label>
        <input
          type="text"
          name="resume"
          value={formData.resume}
          onChange={handleChange}
          placeholder="https://example.com/resume.pdf"
          required
        />
      </div>
      <div className="form-group">
        <label>CV / Summary (paragraph)</label>
        <textarea
          name="cvText"
          value={formData.cvText}
          onChange={handleChange}
          placeholder="Write your CV summary or experience details here"
          rows="5"
        />
      </div>
      <div className="form-group">
        <label>Skills</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />
      </div>
      <div className="form-group">
        <label>Experience</label>
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="2 years"
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default ApplicationForm;
