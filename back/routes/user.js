const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const testEmail = require('../middlewares/testEmailPattern');
const testPassword = require('../middlewares/testPasswordStrength');

router.post('/auth/signup', testEmail, testPassword, userCtrl.register);
router.post('/auth/login', userCtrl.login);
router.delete('/delete', auth, userCtrl.delete);
router.get('/admin/users', auth, userCtrl.getAllUsers);
router.get('/admin/users/:id', auth, userCtrl.getOneUser);
router.get('/profiles/:id', auth, userCtrl.getOneProfile);
router.get('/profiles/', userCtrl.getAllProfiles);
router.post('/profiles/search', userCtrl.searchProfiles);
router.post('/profiles/textsearch', userCtrl.textSearchProfile);

module.exports = router;