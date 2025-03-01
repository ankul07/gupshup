import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using the provided URI.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @throws {Error} If the connection fails, an error is thrown and the process exits.
 */
const connectDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✓ MongoDB connected with server: ${connection.host}`);
  } catch (error) {
    console.error(`✗ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure code
  }
};

export default connectDatabase;
