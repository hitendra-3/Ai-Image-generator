// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import FormData from "form-data";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get("/", (req, res) => {
  res.send("✅ AI Canvas Backend (Stability AI) is running");
});

// Image Generation Route
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("📩 Prompt:", prompt);

    // Use form-data (Stability API expects multipart/form-data)
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "png");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ API Error:", errText);
      return res.status(500).json({ error: "Image generation failed" });
    }

    // Convert binary image to Base64
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ imageUrl });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Server failed to generate image" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
