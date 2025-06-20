const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./api");
const path = require("path");

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan("combined"));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  // This is the URL path you will use in your frontend (HTML, React, Vue, etc.)
  const imageUrl =
    "http://localhost:5000/uploads/avatars/18e79ef8-1bdb-47d0-a8f3-6da03a9cf4e1.jpg";

  res.send(`
        <h1>Here is your image:</h1>
        <img src="${imageUrl}" alt="User Avatar" style="max-width: 300px;">
        <p>Image served from the path: ${imageUrl}</p>
    `);
});

// Error handling
app.use(errorHandler);

module.exports = app;
