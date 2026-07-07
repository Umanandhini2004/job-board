import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EmployerDashboard from './EmployerDashboard';
import { jobsAPI, applicationsAPI } from '../services/api';

jest.mock('../services/api', () => ({
  jobsAPI: {
    getEmployerJobs: jest.fn(),
  },
  applicationsAPI: {
    getJobApplications: jest.fn(),
  },
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Test Employer' } }),
}));

describe('EmployerDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows applicant details for each job posting', async () => {
    jobsAPI.getEmployerJobs.mockResolvedValue({
      data: [
        {
          _id: 'job1',
          title: 'Frontend Developer',
          location: 'Delhi',
          postedDate: '2024-01-01T00:00:00.000Z',
          status: 'Open',
          applicants: [{ _id: 'app1' }],
        },
      ],
    });

    applicationsAPI.getJobApplications.mockResolvedValue({
      data: [
        {
          _id: 'app1',
          status: 'Applied',
          candidate: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9999999999',
            skills: ['React'],
            experience: '2 years',
          },
        },
      ],
    });

    render(<EmployerDashboard />);

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('9999999999')).toBeInTheDocument();
  });
});
