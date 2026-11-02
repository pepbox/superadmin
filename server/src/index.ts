import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import fs from "fs";
import connectDB from "./config/db";
import v1Routes from "./routes/v1/index";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import cookieParser from "cookie-parser";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

connectDB();

const app = express();

// Trust reverse proxy for GCP Cloud Run / Load Balancers
app.set("trust proxy", 1);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const rawFrontendUrls = process.env.FRONTEND_URL || "http://localhost:5171";
const allowedOrigins = rawFrontendUrls
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, curl, Postman, health checks (no origin header)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    let isCloudflarePages = false;
    try {
      const parsed = new URL(origin);
      isCloudflarePages = parsed.hostname.endsWith(".pages.dev");
    } catch {
      isCloudflarePages = false;
    }

    if (
      allowedOrigins.includes(normalizedOrigin) ||
      allowedOrigins.includes("*") ||
      isCloudflarePages
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for GCP Cloud Run / Load Balancers
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.status(200).json({
    name: "PepBox SuperAdmin API",
    status: "online",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/v1", v1Routes);

// Optional static build serving if frontend is bundled in same container
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  const buildPath = path.join(__dirname, "..", "..", "client", "dist");
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(buildPath, "index.html"));
    });
  }
}

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");

const PORT =
  portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : Number(process.env.PORT) || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
