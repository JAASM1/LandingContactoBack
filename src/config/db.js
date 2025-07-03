import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDb connected");
  } catch (error) {
    console.error("Error connected to Mongo", error.message);
    throw error;
  }
};

export default connectDB