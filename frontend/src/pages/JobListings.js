import React, { useEffect, useState } from 'react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [search, location, category]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs({
        search,
        location,
        category,
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-listings-page">
      <div className="search-section">
        <h2>Search Jobs</h2>
        <div className="search-form">
          <input
            type="text"
            placeholder="Job title or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <div className="jobs-list-section">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length > 0 ? (
          <div className="jobs-list">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
};

export default JobListings;
