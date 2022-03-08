const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/auth/signup',userCtrl.register);
router.post('/auth/login',userCtrl.login);
router.delete('/delete',auth,userCtrl.delete);
router.get('/admin/users',auth,userCtrl.getAllUsers);
router.get('/admin/users/:id',auth,userCtrl.getOneUser);

module.exports = router;