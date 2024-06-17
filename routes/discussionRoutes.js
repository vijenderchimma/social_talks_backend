// routes/discussionRoutes.js

const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('File type not supported'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: fileFilter
});

// POST /api/discussions/create
router.post('/create', authMiddleware,upload.single('image'), discussionController.createDiscussion);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName // the name we are stored in database comes in place of imageName
    req.headers('Content-type', 'image/jpeg')
    req.sendFile(path.join(__dirname, '..', 'uploads',imageName))
})

// PUT /api/discussions/:id
router.put('/:id', authMiddleware, upload.single('image'), discussionController.updateDiscussion);

// DELETE /api/discussions/:id
router.delete('/:id', authMiddleware, discussionController.deleteDiscussion);

//GET discussions based on user ID

router.get('/user/:userId',authMiddleware,discussionController.getUserDiscussions)


//GET all discussions

router.get('/alldiscussions',discussionController.getAllDiscussion)

// GET /api/discussions/tags/:tags
router.get('/tags', authMiddleware, discussionController.getDiscussionsByTags);

// GET /api/discussions/search/:text
router.get('/search/:text', authMiddleware, discussionController.getDiscussionsByText);

module.exports = router;
