import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

/**
 * @desc Enable CORS (Cross-Origin Resource Sharing)
 * @config Allows requests from all origins (*), enables credentials, and restricts HTTP methods
 */
app.use(
  cors({
    origin: "https://gupshup-ankulcode.vercel.app", // Allow requests from this origin
    credentials: true, // Allow cookies and authorization headers
    methods: ["POST", "GET", "DELETE", "PUT"], // Allowed HTTP methods
  })
);
// app.use(cors());
// Middleware to parse incoming JSON data
app.use(express.json());

/**
 * @desc Middleware to parse cookies from incoming requests
 */
app.use(cookieParser());

/**
 * @route   GET /test
 * @desc    A test route to check server status
 * @access  Public
 */
app.get("/api", (req, res) => {
  res.json({ message: "Backend Running Successfully!" });
});
/**
 * @desc Middleware to parse URL-encoded bodies
 * @config Extended: true allows for rich objects and arrays
 * @config Limit: "50mb" increases the payload limit
 */
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/**
 * @desc Import and use user-related routes
 */
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

/**
 * @desc Global error handling middleware
 */
app.use(globalErrorHandler);

export default app;
