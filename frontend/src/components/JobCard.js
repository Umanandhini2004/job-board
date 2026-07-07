import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <Link to={`/job/${job._id}`} className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className="job-type">{job.jobType}</span>
      </div>
      <p className="company">{job.employer?.name}</p>
      <p className="location">{job.location}</p>
      <p className="description">{job.description.substring(0, 100)}...</p>
      <div className="job-card-footer">
        <p className="salary">
          ₹{job.salary?.min} LPA - ₹{job.salary?.max} LPA
        </p>
        <span className="applicants">{job.applicants?.length || 0} applicants</span>
      </div>
    </Link>
  );
};

export default JobCard;
