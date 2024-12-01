import mongoose, { Schema } from "mongoose";

const AssignmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    remark: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  { timestamps: false }
);

AssignmentSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    switch (this.status) {
      case "accepted":
        this.acceptedAt = new Date();
        this.rejectedAt = null;
        break;
      case "rejected":
        this.rejectedAt = new Date();
        this.acceptedAt = null;
        break;
      default:
        this.acceptedAt = null;
        this.rejectedAt = null;
        break;
    }
  }
  next();
});

export const Assignment = mongoose.model("Assignment", AssignmentSchema);