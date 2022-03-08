const express = require('express');
const router = express.Router();

const PostCtrl = require('../controllers/post');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/posts', PostCtrl.getAllPosts);
router.get('/posts/:id', PostCtrl.getOnePost);
router.post('/posts',auth, upload, PostCtrl.postPost);
router.put('/posts/:id',auth, upload, PostCtrl.editPost);
router.delete('/posts/:id',auth, PostCtrl.deletePost);
router.post('/posts/:id/like',auth, PostCtrl.postLike);

module.exports = router;