require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { connection: db, Availability } = require("./models");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api", routes);

// Main Route
app.get("/", (req, res) => res.send(`Server is running on port ${PORT}`));

// Route for db reset => used for dev only
app.get("/reset-database", async (req, res) => {
    try {
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await db.sync({ force: true });
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        res.status(200).send("Database has been reset successfully!");
    } catch (error) {
        console.error("Error resetting database:", error);
        res.status(500).send("Database reset failed!");
    }
});

// open the server
app.listen(PORT, () => console.log(`Serverul rulează pe http://localhost:${PORT}`));
