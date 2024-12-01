import { User } from "../models/user.model.js";
import { Assignment } from "../models/assignment.model.js";
import { generateToken } from "../middleware/auth.middleware.js";
import { validateLogin, validateUser } from "../validation/user.validation.js";
import { validateAssigmentStatus } from "../validation/assignment.validation.js";
import { formatDate } from "../utils/format_date.utils.js";

/**
 * @route POST /api/admin/register
 * @description Admin Registration
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

    const existingAdmin = await User.findOne({
      $or: [{ email }, { username }],
      role: "admin",
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const admin = new User({ username, email, password, role: "admin" });
    await admin.save();

    const token = generateToken(admin);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: formatDate(admin.createdAt),
        updatedAt: formatDate(admin.updatedAt),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during admin registration",
    });
  }
};

/**
 * @route POST /api/admin/login
 * @description Admin Login
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

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin || !(await admin.isPasswordCorrect(password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(admin);
    const loginAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        loginAt: formatDate(loginAt),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

/**
 * @route GET /api/admin/assignments
 * @description Get all assignments
 * @access Private (Admin only)
 */
const viewAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      adminId: req.user._id,
    })
      .populate("userId", "username")
      .populate("adminId", "username");

    const formattedAssignments = assignments.map((assignment) => {
      const {
        _id,
        userId,
        adminId,
        task,
        status,
        submittedAt,
        acceptedAt,
        rejectedAt,
      } = assignment;

      return {
        id: _id,
        user: userId?.username,
        admin: adminId?.username,
        task,
        status,
        submittedAt: formatDate(submittedAt),
        acceptedAt: status === "accepted" ? formatDate(acceptedAt) : null,
        rejectedAt: status === "rejected" ? formatDate(rejectedAt) : null,
      };
    });

    res.status(200).json({
      success: true,
      message: "Assignments fetched successfully",
      assignments: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
    });
  }
};

/**
 * @route POST /api/admin/assignments/:id/accept
 * @description Accept an assignment
 * @access Private (Admin only)
 */
const acceptAssignment = async (req, res) => {
  const { error } = validateAssigmentStatus(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { id } = req.params;
    const { remark } = req.body;

    const assignment = await Assignment.findById(id)
      .populate("userId", "username")
      .populate("adminId", "username");
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    assignment.status = "accepted";
    assignment.remark = remark;
    assignment.reviewedAt = new Date();
    assignment.acceptedAt = new Date();
    assignment.rejectedAt = null;
    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Assignment accepted",
      assignment: {
        id: assignment._id,
        user: assignment.userId?.username,
        admin: assignment.adminId?.username,
        task: assignment.task,
        status: assignment.status,
        remark: assignment.remark,
        submittedAt: formatDate(assignment.submittedAt),
        acceptedAt: formatDate(assignment.acceptedAt),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error accepting assignment" });
  }
};

/**
 * @route POST /api/admin/assignments/:id/reject
 * @description Reject an assignment
 * @access Private (Admin only)
 */
const rejectAssignment = async (req, res) => {
  const { error } = validateAssigmentStatus(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { id } = req.params;
    const { remark } = req.body;

    const assignment = await Assignment.findById(id)
      .populate("userId", "username")
      .populate("adminId", "username");
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    assignment.status = "rejected";
    assignment.remark = remark;
    assignment.rejectedAt = new Date();
    assignment.acceptedAt = null;
    await assignment.save();

    res.json({
      success: true,
      message: "Assignment rejected",
      assignment: {
        id: assignment._id,
        user: assignment.userId?.username,
        admin: assignment.adminId?.username,
        task: assignment.task,
        status: assignment.status,
        remark: assignment.remark,
        submittedAt: formatDate(assignment.submittedAt),
        rejectedAt: formatDate(assignment.rejectedAt),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error rejecting assignment" });
  }
};

export { register, login, viewAssignments, acceptAssignment, rejectAssignment };