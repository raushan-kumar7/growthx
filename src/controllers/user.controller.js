import { User } from "../models/user.model.js";
import { Assignment } from "../models/assignment.model.js";
import { generateToken } from "../middleware/auth.middleware.js";
import { validateLogin, validateUser } from "../validation/user.validation.js";
import { validateAssignment } from "../validation/assignment.validation.js";
import { formatDate } from "../utils/format_date.utils.js";

/**
 * @route POST /api/user/register
 * @description User Registration
 * @access Public
 */
const register = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    const user = new User({
      username,
      email,
      password,
      role: "user",
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: formatDate(user.createdAt),
        updatedAt: formatDate(user.updatedAt),
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};


/**
 * @route POST /api/user/login
 * @description User Login
 * @access Public
 */
const login = async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    const loginAt = new Date().toISOString();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        loginAt: formatDate(loginAt),
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};


/**
 * @route GET /api/user/upload
 * @description Upload Assignment
 * @access Private (Only Users can upload)
 */
const uploadAssignment = async (req, res) => {
  const { error } = validateAssignment(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { user, admin, task, remark } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const adminUser = await User.findOne({
      username: admin,
      role: "admin",
    });

    if (!adminUser) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    if (req.user.username !== user) {
      return res.status(403).json({
        success: false,
        message: "You can only upload assignments for yourself",
      });
    }

    const userData = await User.findOne({
      username: user,
      role: "user",
    });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const assignment = new Assignment({
      userId: userData._id,
      adminId: adminUser._id,
      task,
      remark: remark || "",
      status: "pending",
    });

    await assignment.save();

    res.status(201).json({
      success: true,
      message: "Assignment uploaded successfully",
      assignment: {
        id: assignment._id,
        user: userData.username,
        admin: adminUser.username,
        task,
        remark,
        status: assignment.status,
        submittedAt: formatDate(assignment.submittedAt),
      },
    });
  } catch (error) {
    console.error("Error uploading assignment:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading assignment",
      errorDetails: error.message,
    });
  }
};

/**
 * @route GET /api/user/admins
 * @description Get all admins
 * @access Private (User only)
 */
const fetchAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("username email");

    const fetchedAt = new Date().toISOString();

    res.status(200).json({
      fetchedAt: formatDate(fetchedAt),
      success: true,
      message: "Admins fetched successfully",
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ success: false, message: "Error fetching admins" });
  }
};

export { register, login, uploadAssignment, fetchAdmins };