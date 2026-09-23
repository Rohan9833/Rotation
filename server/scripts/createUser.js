// Usage: npm run create-user -- <username> <password>
// Creates the user, or resets the password if the username already exists.
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";

const [, , rawName, password] = process.argv;
if (!rawName || !password || password.length < 6) {
  console.error("Usage: npm run create-user -- <username> <password (min 6 chars)>");
  process.exit(1);
}
const username = rawName.trim().toLowerCase();

await mongoose.connect(process.env.MONGO_URI);
await User.findOneAndUpdate(
  { username },
  { username, passwordHash: await bcrypt.hash(password, 10) },
  { upsert: true }
);
console.log(`Saved user "${username}"`);
await mongoose.disconnect();
