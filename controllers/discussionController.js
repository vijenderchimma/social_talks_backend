// controllers/discussionController.js

const Discussion = require('../models/Discussion');

// Create discussion
exports.createDiscussion =  async (req, res) => {
    const { text, hashtags } = req.body;
    const createdBy = req.user.id; // Authenticated user id
    const image = req.file ? req.file.filename: undefined
    console.log(createdBy)

    try {
        const newDiscussion = new Discussion({
            text,
            image,
            hashtags:hashtags.split(',').map(tag => tag.trim()),
            createdBy
        });

        await newDiscussion.save();

        res.status(200).json({ message: 'Discussion created successfully', discussion: newDiscussion });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update discussion
exports.updateDiscussion = async (req, res) => {
    const { text, hashtags } = req.body;

    try {
        let discussion = await Discussion.findById(req.params.id);
        const image = req.file ? req.file.filename: undefined

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        discussion.text = text;
        discussion.image = image;
        discussion.hashtags =  hashtags.split(',').map(tag => tag.trim());

        await discussion.save();

        res.json(discussion);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserDiscussions = async (req,res) =>{
    try {
        const userDiscussions = await Discussion.find({createdBy:req.params.userId})
        if (!userDiscussions){
            return res.status(404).json("discussion not found")
        }

        res.status(200).json( userDiscussions)
    } catch (error) {
        console.log(error)
        res.status(200).json({message: "Internal server error"})
    }
}

//alldiscussions
exports.getAllDiscussion = async (req,res)=>{
    try {
        const discussionList = await Discussion.find()
        if(!discussionList){
            return res.status(404).json("discussion not found")
        }
        res.status(200).json(discussionList)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

// Delete discussion
exports.deleteDiscussion = async (req, res) => {
    try {
        let discussion = await Discussion.findByIdAndDelete(req.params.id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }



        res.status(200).json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get discussions by tags
exports.getDiscussionsByTags = async (req, res) => {
    const tags  = req.query.tags;

    try {
        const discussions = await Discussion.find({ hashtags: { $in: tags } });
        res.json(discussions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get discussions by text
exports.getDiscussionsByText = async (req, res) => {
    const { text } = req.params;

    try {
        const discussions = await Discussion.find({ text: { $regex: text, $options: 'i' } });
        res.json(discussions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};
