const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/posts', postCtrl.getAllPosts);
router.get('/posts/:id', postCtrl.getOnePost);
router.post('/posts',auth, upload, postCtrl.postPost);
router.put('/posts/:id',auth, upload, postCtrl.editPost);
router.delete('/posts/:id',auth, postCtrl.deletePost);
router.post('/posts/:id/like',auth, postCtrl.postLike);

router.get('/posts/:id/comments',auth,commentCtrl.getAllCommentsFromPost);
router.post('/posts/:id/comments',auth, commentCtrl.postComment);
router.delete('/comments/:id',auth, commentCtrl.deleteComment);

module.exports = router;