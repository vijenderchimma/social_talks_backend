const express = require('express');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create a new comment
router.post('/discussions/:discussionId/comments', auth, commentController.createComment);

// Update a comment
router.put('/comments/:commentId', auth, commentController.updateComment);

// Delete a comment
router.delete('/comments/:commentId', auth, commentController.deleteComment);

// Like a comment
router.post('/comments/:commentId/like', auth, commentController.likeComment);

// Unlike a comment
router.post('/comments/:commentId/unlike', auth, commentController.unlikeComment);

// Reply to a comment
router.post('/discussions/:discussionId/comments/:commentId/reply', auth, commentController.replyToComment);

module.exports = router;
