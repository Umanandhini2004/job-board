const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

exports.applyForJob = async (req, res) => {
  try {
    const { jobId, resume, cvText, skills, experience, phone } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.userId);

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.userId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      candidate: req.userId,
      resume,
      cvText,
      skills,
      experience,
      phone,
      email: user.email,
    });

    await application.save();
    job.applicants.push(application._id);
    await job.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.userId })
      .populate('job', 'title company location')
      .sort({ appliedDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone skills experience')
      .sort({ appliedDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job);
    if (job.employer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
