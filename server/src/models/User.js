import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    // last card order scanned by this user (restored on display reconnect)
    currentSequence: { type: String, default: null },
    sequenceUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
