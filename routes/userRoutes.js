// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// PUT /api/users/:id
router.put('/update/:userId', authMiddleware, userController.updateUser);

// DELETE /api/users/:id
router.delete('/delete/:userId', authMiddleware, userController.deleteUser);

// GET /api/users
router.get('/', authMiddleware, userController.getUserList);
//GEt user based on id
router.get('/:userId', authMiddleware, userController.getUser);
// GET /api/users/search?name=name
router.get('/search', authMiddleware, userController.searchUser);

router.post(`/:userId/follow`,authMiddleware,userController.followUser)

router.post(`/:userId/unfollow`,authMiddleware,userController.unfollowUser)

module.exports = router;
