const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
require("dotenv").config();

// Initialize Express and Prisma
const app = express();
// const prisma = new PrismaClient();

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session management with Prisma Session Store
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "super-secret-key", // Replace with an actual secret in production
//     resave: false,
//     saveUninitialized: false,
//     store: new PrismaSessionStore(prisma, {
//       checkPeriod: 2 * 60 * 1000, // Check for expired sessions every 2 minutes
//     }),
//   })
// );

// Routes


// Home route
app.get("/", (req, res) => {
  res.render("pages/home");
});

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
