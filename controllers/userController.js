// controllers/userController.js

const User = require('../models/User');

// Update user
exports.updateUser = async (req, res) => {
    const { name, mobileNo, email } = req.body;

    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name;
        user.mobileNo = mobileNo;
        user.email = email;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
    const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // await user.remove();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get list of users
exports.getUserList = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Search user by name
exports.searchUser = async (req, res) => {
    const { name } = req.query;

    try {
        const users = await User.find({ name: { $regex: name, $options: 'i' } }).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.followUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!user || !currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!currentUser.following.includes(user.id)) {
            currentUser.following.push(user.id);
            await currentUser.save();
        }

        res.json({ message: 'User followed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
        await currentUser.save();

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


