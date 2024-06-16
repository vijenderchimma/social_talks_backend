// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// PUT /api/users/:id
router.put('/:id', authMiddleware, userController.updateUser);

// DELETE /api/users/:id
router.delete('/delete/:id', authMiddleware, userController.deleteUser);

// GET /api/users
router.get('/', authMiddleware, userController.getUserList);

// GET /api/users/search?name=name
router.get('/search', authMiddleware, userController.searchUser);

router.post(`/:userId/follow`,authMiddleware,userController.followUser)

router.post(`/:userId/unfollow`,authMiddleware,userController.unfollowUser)

module.exports = router;
