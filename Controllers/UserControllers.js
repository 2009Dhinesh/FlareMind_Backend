const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ================== Register ==================
const Register = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { firstname, lastname, phnumber, email, password } = req.body;

    if (!firstname || !lastname || !phnumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ message: "User already registered with this email" });
    }

    const existingPhone = await User.findOne({ phnumber });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      phnumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registered Successfully",
      data: {
        firstname,
        lastname,
        phnumber,
        email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================== Login ==================
const Login = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const tokenPayload = {
      _id: validUser._id,
      firstname: validUser.firstname,
      lastname: validUser.lastname,
      email: validUser.email,
      phnumber: validUser.phnumber,
    };

    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: tokenPayload,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ================== Logout ==================
const logout = async (_req, res) => {
  return res.json({ success: true, message: "Logged out (remove token client-side)" });
};



// ================== Update Me ==================
const updateMe = async (req, res) => {
  try {
    const allowed = ["firstname", "lastname", "phnumber", "email"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    return res.json({ success: true, user: updated });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== Get All Users ==================
const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json({ success: true, users });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// ================== Get Other Users ==================
const getOtherUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password" 
    );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Other Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


module.exports = {
  Register,
  Login,
  logout,
  updateMe,
  getAllUsers,
  getOtherUsers,
};
