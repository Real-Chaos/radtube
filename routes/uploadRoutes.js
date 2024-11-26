const express = require('express');
const upload = require('../middlewares/multerConfig');
const uploadController = require('../controllers/uploadController');
const {ensureAuthenticated} = require('../middlewares/authMiddleware')
const router = express.Router();

// Single file upload route
router.post('/upload', ensureAuthenticated, upload.single('file'), uploadController.uploadFile);

// Fetch all files for the logged-in user (protected)
router.get('/files', ensureAuthenticated, uploadController.getUserFiles);

module.exports = router;
