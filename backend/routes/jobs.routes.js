const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createJob,
  getAllJobs,
  getJobById,
  applyForJob,
  deleteJob,
  getMyJobs,
  getMyApplications
} = require('../controllers/jobs.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getAllJobs);

router.get('/my-jobs', protect, authorize('employer', 'admin'), getMyJobs);

router.get('/my-applications', protect, getMyApplications);

router.get('/:id', getJobById);

router.post(
  '/',
  protect,
  authorize('employer', 'admin'),
  [
    body('title', 'Title is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('company', 'Company name is required').not().isEmpty(),
    body('location', 'Location is required').not().isEmpty()
  ],
  createJob
);

router.post('/:id/apply', protect, applyForJob);

router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;
