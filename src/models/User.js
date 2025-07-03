import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: String,
  rol: {
    type: String,
    default: 'admin'
  }
});

export default mongoose.model("User", userSchema);
