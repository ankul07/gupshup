import dotenv from "dotenv";
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}
import app from "./app.js";
import path from "path";
import connectDatabase from "./config/db.js";

/**
 * Load environment variables from .env file in non-production environments
 */

/**
 * Handle uncaught exceptions (e.g., synchronous code errors that aren't caught)
 */
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to an uncaught exception");
  process.exit(1); // Exit process with failure code
});

/**
 * Connect to MongoDB database
 */
connectDatabase();

/**
 * Start the Express server
 */
const server = app.listen(process.env.PORT, () => {
  console.log(`✓ Server is running on http://localhost:${process.env.PORT}`);
});

/**
 * Handle unhandled promise rejections (e.g., failed database connections)
 */
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server due to: ${err.message}`);
  console.log("Shutting down the server due to an unhandled promise rejection");

  // Gracefully close the server before exiting
  server.close(() => {
    process.exit(1); // Exit process with failure code
  });
});
