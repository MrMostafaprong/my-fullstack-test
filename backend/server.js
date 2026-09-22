const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is online 🚀"
    });
});

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello from Vercel Backend!",
        success: true
    });
});

app.post("/api/message", (req, res) => {
    const { message } = req.body;

    res.json({
        received: message,
        reply: "Message received successfully!"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
