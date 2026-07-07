import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, jobsAPI } from '../services/api';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [applicantsByJob, setApplicantsByJob] = useState({});
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    salary: { min: 0, max: 0 },
    jobType: 'Full-time',
    skills: [],
    experience: '',
  });

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    try {
      const response = await jobsAPI.getEmployerJobs();
      setJobs(response.data);

      if (response.data.length > 0) {
        setLoadingApplicants(true);
        const applicantsPromises = response.data.map(async (job) => {
          try {
            const applicantResponse = await applicationsAPI.getJobApplications(job._id);
            return { jobId: job._id, applicants: applicantResponse.data };
          } catch (error) {
            console.error(`Error fetching applicants for job ${job._id}:`, error);
            return { jobId: job._id, applicants: [] };
          }
        });

        const applicantResults = await Promise.all(applicantsPromises);
        const applicantMap = applicantResults.reduce((acc, { jobId, applicants }) => {
          acc[jobId] = applicants;
          return acc;
        }, {});
        setApplicantsByJob(applicantMap);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setLoadingApplicants(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        salary: { ...formData.salary, [field]: parseInt(value) },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingJobId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      salary: { min: 0, max: 0 },
      jobType: 'Full-time',
      skills: [],
      experience: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await jobsAPI.updateJob(editingJobId, formData);
      } else {
        await jobsAPI.createJob(formData);
      }
      resetForm();
      fetchEmployerJobs();
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      category: job.category,
      location: job.location,
      salary: job.salary || { min: 0, max: 0 },
      jobType: job.jobType,
      skills: job.skills || [],
      experience: job.experience || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await jobsAPI.deleteJob(jobId);
      fetchEmployerJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="employer-dashboard">
      <h1>Employer Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Job Postings</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {showForm && (
          <form className="job-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="salary.min"
              placeholder="Minimum Salary (₹ LPA)"
              value={formData.salary.min}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="salary.max"
              placeholder="Maximum Salary (₹ LPA)"
              value={formData.salary.max}
              onChange={handleInputChange}
            />
            <select name="jobType" value={formData.jobType} onChange={handleInputChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <textarea
              name="experience"
              placeholder="Experience Required"
              value={formData.experience}
              onChange={handleInputChange}
            />
            <button type="submit" className="btn btn-primary">
              {editingJobId ? 'Update Job' : 'Post Job'}
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="jobs-table">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Posted Date</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const applicants = applicantsByJob[job._id] || [];
                  return (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.location}</td>
                      <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                      <td>{job.status}</td>
                      <td>
                        {loadingApplicants ? (
                          'Loading...'
                        ) : applicants.length > 0 ? (
                          <div>
                            {applicants.map((application) => (
                              <div key={application._id} style={{ marginBottom: '8px' }}>
                                <strong>{application.candidate?.name || 'Unknown candidate'}</strong>
                                <div>Email: {application.candidate?.email || application.email || 'N/A'}</div>
                                <div>Phone: {application.phone || application.candidate?.phone || 'N/A'}</div>
                                <div>Skills: {application.skills?.join(', ') || application.candidate?.skills?.join(', ') || 'N/A'}</div>
                                <div>Experience: {application.experience || application.candidate?.experience || 'N/A'}</div>
                                <div>Status: {application.status}</div>
                                <div>
                                  Resume:{' '}
                                  {application.resume ? (
                                    <a href={application.resume} target="_blank" rel="noreferrer">
                                      View resume
                                    </a>
                                  ) : (
                                    'Not uploaded'
                                  )}
                                </div>
                                <div>
                                  CV Text:{' '}
                                  {application.cvText ? (
                                    application.cvText
                                  ) : (
                                    'Not provided'
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          'No applicants yet'
                        )}
                      </td>
                      <td>
                        <button className="btn btn-small" onClick={() => handleEdit(job)}>
                          Edit
                        </button>
                        <button className="btn btn-small btn-danger" onClick={() => handleDelete(job._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
