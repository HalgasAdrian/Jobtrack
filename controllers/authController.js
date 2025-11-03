import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import mongodb from "mongodb"

export const register = async (req, res) => {
    try {
    const db = req.db;
    const users = db.collection("users");

    const { firstName, lastName, username, email, password } = req.body;

    const existingUser = await users.findOne({
        $or: [{email}, {username}],
    });

    if (existingUser) {
        if (existingUser.email === email) {
            return res.status(400).json({ message: "Account with email already exists"});
        }
        if (existingUser.username === username) {
            return res.status(400).json({ message: "Account with username already exists"});
        }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await users.insertOne({
        firstName,
        lastName,
        username,
        email,
        password: passwordHash,
        createdAt: Date.now(),
    });
    return res.status(200).json({ message: "User registered successfully!"});
    } catch (error) {
        console.log("Error registering user: ", error);
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const db = req.db;
        const users = db.collection("users");

        const { identifer, password } = req.body;
        const user = await users.findOne({
            $or: [{email: identifer}, {username: identifer}],
        });

        if (!user) {
            return res.status(400).json({ message: "User with this identifer does not exist!"});
        }

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) {
            return res.status(400).json({ message: "The password is incorrect! " });
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({ message: "User logged in successfully!", token });
    } catch (error) {
        console.log("Error loggin in user: ", error);
        res.status(500).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
    const db = req.db;
    const users = db.collection("users");

    const userId = req.user.id;
    if (typeof userId === "string" && userId.length === 24) {
        userId = new mongodb.ObjectId(userId);
    }

    const user = await users.findOne({
        _id: userId
    });

    if (!user) {
        return res.status(400).json({ message: "User not found!" });
    }

    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
    });

    } catch (error) {
        console.log("Error fetching user: ", error);
        return res.status(500).json({ message: error.message });
    }
}
