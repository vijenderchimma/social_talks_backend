// routes/discussionRoutes.js

const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const authMiddleware = require('../middleware/auth');

// POST /api/discussions/create
router.post('/create', authMiddleware, discussionController.createDiscussion);

// PUT /api/discussions/:id
router.put('/:id', authMiddleware, discussionController.updateDiscussion);

// DELETE /api/discussions/:id
router.delete('/:id', authMiddleware, discussionController.deleteDiscussion);

// GET /api/discussions/tags/:tags
router.get('/tags', authMiddleware, discussionController.getDiscussionsByTags);

// GET /api/discussions/search/:text
router.get('/search/:text', authMiddleware, discussionController.getDiscussionsByText);

module.exports = router;
