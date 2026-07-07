import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import ResumeUploadModal from '../components/ResumeUploadModal';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await jobsAPI.getAllJobs({ limit: 6 });
      setFeaturedJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Find Your Dream Job</h1>
        <p>Browse thousands of job openings and apply directly</p>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (user) {
                setShowUploadModal(true);
              } else {
                navigate('/register?role=candidate');
              }
            }}
          >
            Upload Your Resume
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
        <ResumeUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => navigate('/candidate-dashboard')}
        />
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>4536+</h3>
          <p>Jobs Listed</p>
        </div>
        <div className="stat-card">
          <h3>1200+</h3>
          <p>Companies</p>
        </div>
        <div className="stat-card">
          <h3>50K+</h3>
          <p>Successful Placements</p>
        </div>
      </div>

      <div className="featured-jobs-section">
        <h2>Featured Job Listings</h2>
        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="jobs-grid">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
