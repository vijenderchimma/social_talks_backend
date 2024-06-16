const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const comment = new Comment({
            ...req.body,
            user: req.user.id,
            discussion: req.params.discussionId
        });
        await comment.save();

        // Add the comment to the discussion
        await Discussion.findByIdAndUpdate(req.params.discussionId, { $push: { comments: comment._id } });

        res.status(200).send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndUpdate(
            { _id: req.params.commentId, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!comment) {
            return res.status(404).send("comment not found");
        }

        res.send({comment,message: "updated Successfully"});
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({ _id: req.params.commentId, user: req.user.id });

        if (!comment) {
            return res.status(404).send("comment not found");
        }

        // Remove the comment from the discussion
        await Discussion.findByIdAndUpdate(comment.discussion, { $pull: { comments: comment._id } });

        res.send({comment,message: "comment deleted successfully"});
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
