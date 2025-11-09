import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongodb from "mongodb";

export const register = async (req, res) => {
  try {
    const db = req.db;
    const users = db.collection("users");

    const { firstName, lastName, username, email, password } = req.body;

    const existingUser = await users.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: "Account with email already exists" });
      }
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ message: "Account with username already exists" });
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
    return res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log("Error registering user: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const db = req.db;
    const users = db.collection("users");

    const { identifer, password } = req.body;
    const user = await users.findOne({
      $or: [{ email: identifer }, { username: identifer }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this identifer does not exist!" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(400).json({ message: "The password is incorrect! " });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "User logged in successfully!", token });
  } catch (error) {
    console.log("Error loggin in user: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const db = req.db;
    const users = db.collection("users");

    let userId = req.user.id;
    if (typeof userId === "string" && userId.length === 24) {
      userId = new mongodb.ObjectId(userId);
    }

    const user = await users.findOne({
      _id: userId,
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
};

export const updateUser = async (req, res) => {
  try {
    const db = req.db;
    const users = db.collection("users");

    let userId = req.user.id;
    if (typeof userId === "string" && userId.length === 24) {
      userId = new mongodb.ObjectId(userId);
    }

    const { firstName, lastName, username, email } = req.body;

    // Check if username or email is being changed and if they're already taken
    const existingUser = await users.findOne({
      _id: { $ne: userId },
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: "Email already taken by another user" });
      }
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ message: "Username already taken by another user" });
      }
    }

    const updateData = {
      firstName,
      lastName,
      username,
      email,
      updatedAt: Date.now(),
    };

    const result = await users.updateOne({ _id: userId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        firstName,
        lastName,
        username,
        email,
      },
    });
  } catch (error) {
    console.log("Error updating user: ", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const db = req.db;
    const users = db.collection("users");

    let userId = req.user.id;
    if (typeof userId === "string" && userId.length === 24) {
      userId = new mongodb.ObjectId(userId);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await users.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await users.updateOne(
      { _id: userId },
      { $set: { password: newPasswordHash, updatedAt: Date.now() } },
    );

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.log("Error updating password: ", error);
    return res.status(500).json({ message: error.message });
  }
};
