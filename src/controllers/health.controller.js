import { formatDate } from "../utils/format_date.utils.js";

const healthStatus = (req, res) => {
  const time = new Date().toLocaleDateString("en-IN");
  res.status(200).json({
    status: "success",
    success: true,
    message: "Server is healthy and running!",
    uptime: process.uptime(),
    timestamp: formatDate(time),
  });
};

const welcomeMessage = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the GrowthX Assignment Submission Portal API!",
  });
};

export { healthStatus, welcomeMessage };