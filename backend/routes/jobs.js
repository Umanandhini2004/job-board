const express = require('express');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', authMiddleware, jobController.updateJob);
router.delete('/:id', authMiddleware, jobController.deleteJob);
router.get('/employer/my-jobs', authMiddleware, jobController.getEmployerJobs);

module.exports = router;
