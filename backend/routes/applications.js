const express = require('express');
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, applicationController.applyForJob);
router.get('/', authMiddleware, applicationController.getApplications);
router.get('/job/:jobId', authMiddleware, applicationController.getJobApplications);
router.put('/:applicationId', authMiddleware, applicationController.updateApplicationStatus);

module.exports = router;
