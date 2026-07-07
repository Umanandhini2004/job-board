import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applicationsAPI, jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplicationForm from '../components/ApplicationForm';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    if (user?.role === 'candidate') {
      checkAppliedStatus();
    }
  }, [id, user?.role]);

  const fetchJobDetail = async () => {
    try {
      const response = await jobsAPI.getJobById(id);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAppliedStatus = async () => {
    try {
      const response = await applicationsAPI.getApplications();
      const applied = response.data.some((application) => application.job?._id === id || application.job === id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="job-detail-page">
      <div className="job-header">
        <h1>{job.title}</h1>
        <p className="company">{job.employer?.name}</p>
        <p className="location">{job.location}</p>
      </div>

      <div className="job-content">
        <div className="job-main">
          <section className="job-section">
            <h3>Job Description</h3>
            <p>{job.description}</p>
          </section>

          <section className="job-section">
            <h3>Requirements</h3>
            <ul>
              {job.skills?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section className="job-section">
            <h3>Experience Required</h3>
            <p>{job.experience}</p>
          </section>
        </div>

        <div className="job-sidebar">
          <div className="job-info-card">
            <p>
              <strong>Salary:</strong> ₹{job.salary?.min} LPA - ₹{job.salary?.max} LPA
            </p>
            <p>
              <strong>Job Type:</strong> {job.jobType}
            </p>
            <p>
              <strong>Category:</strong> {job.category}
            </p>
            <p>
              <strong>Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}
            </p>
          </div>

          {user && user.role === 'candidate' && (
            <>
              {hasApplied ? (
                <p style={{ fontWeight: '600' }}>You have already applied for this job.</p>
              ) : !showApplicationForm ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowApplicationForm(true)}
                >
                  Apply Now
                </button>
              ) : (
                <ApplicationForm jobId={id} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
