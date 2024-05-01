import mongoose from "mongoose";

const url = process.env.NEXT_PUBLIC_MONGODB_URI;
let connection: typeof mongoose;

const connectToDatabase = async () => {
  if (!connection) connection = await mongoose.connect(url || "");
  return connection;
};

export default connectToDatabase;
