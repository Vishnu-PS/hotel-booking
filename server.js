const express = require("express");
const app = express();
const router = require("./app/routers");
const PORT = 3000;

app.use(express.json());
app.use("/api", router);

// Handle 404 - Non-existing Routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
