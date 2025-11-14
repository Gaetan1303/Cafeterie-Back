const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middlewares/auth');

// GET /profile/me : infos utilisateur connecté
router.get('/me', auth, profileController.getProfile);

// PUT /profile/me : modifier profil utilisateur connecté
router.put('/me', auth, profileController.updateProfile);

module.exports = router;
