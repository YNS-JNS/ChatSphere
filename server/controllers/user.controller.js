import User from '../models/user.model.js';

const createUser = async (req, res) => {

    if (!req.body || !req.body.userName) {
        return res.status(400).send({ message: "Invalid request, userName is required" });
    }

    try {
        const existingUser = await User.findOne({ userName: req.body.userName });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = new User(req.body);

        const savedUser = await newUser.save();

        res.status(200).json({ message: "User saved successfully", savedUser });

    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Failed to save user", error: err });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (err) {
        // console.error(err);
        res.status(400).json({ message: "Failed to retrieve users", error: err });
    }
}

export { createUser, getUsers };
