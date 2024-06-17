const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

// Create a new comment
exports.createComment = async (req, res) => {
    const { discussionId } = req.params;
    const { text } = req.body;
    const userId = req.user.id; // Ensure authMiddleware sets req.user

    try {
        const newComment = new Comment({
            text,
            createdBy: userId,
            discussion: discussionId
        });

        await newComment.save();

        // Optionally, update the discussion with the new comment
        await Discussion.findByIdAndUpdate(discussionId, {
            $push: { comments: newComment._id }
        });

        res.status(200).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { id: userId } = req.user;

        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, createdBy: userId }, // Use the correct field for the user
            { ...req.body }, // Spread the req.body as an object
            { new: true, runValidators: true }
        );

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({ comment, message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//get all comments

exports.getAllComments = async (req,res) =>{
    try {
        const comments = await Comment.find()
        if(!comments) {
            return res.status(404).send("comment not found");
        }

        res.status(200).json(comments)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
}

// Delete a comment
exports.deleteComment = async (req, res) => {
    const {commentId} = req.params
    const {id:userId} = req.user
    try {
        const comment = await Comment.findOneAndDelete({ _id: commentId, createdBy: userId });

        if (!comment) {
            return res.status(404).send("comment not found");
        }

        // Remove the comment from the discussion
        await Discussion.findByIdAndUpdate(comment.discussion, { $pull: { comments: comment._id } });

        res.send({ comment, message: "comment deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Like a comment
exports.likeComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { $addToSet: { likes: req.user.id } },
            { new: true }
        );

        if (!comment) {
            return res.status(404).send("comment not found");
        }

        res.send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Unlike a comment
exports.unlikeComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { $pull: { likes: req.user.id } },
            { new: true }
        );

        if (!comment) {
            return res.status(404).send();
        }

        res.send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
    try {
        const reply = new Comment({
            ...req.body,
            user: req.user.id,
            discussion: req.params.discussionId,
        });
        await reply.save();

        // Add the reply to the parent comment
        await Comment.findByIdAndUpdate(req.params.commentId,
            { $push: { replies: reply._id } },
            { new: true });

        res.status(200).send(reply);
    } catch (error) {
        res.status(400).send(error);
    }
};
