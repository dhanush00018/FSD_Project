const Job = require('../models/Job');
const { validationResult } = require('express-validator');

exports.createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const jobData = {
      ...req.body,
      employer: req.user.id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { search, jobType, location } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email')
      .populate('applicants.user', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const alreadyApplied = job.applicants.find(
      (applicant) => applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    if (job.employer.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply for your own job posting'
      });
    }

    job.applicants.push({
      user: req.user.id,
      coverLetter: req.body.coverLetter || ''
    });

    await job.save();

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .populate('applicants.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      'applicants.user': req.user.id
    }).populate('employer', 'name email');

    const applications = jobs.map(job => {
      const application = job.applicants.find(
        app => app.user.toString() === req.user.id
      );
      return {
        job: {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          employer: job.employer
        },
        appliedAt: application.appliedAt,
        status: application.status
      };
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
