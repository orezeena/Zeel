require("dotenv").config();
const axios = require("axios");
const express = require("express");
const ejs = require("ejs");
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;

// Airtable Config
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = "Blog Posts"; // Update with your table name

const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`;

app.use(express.json());
app.set('view engine', 'ejs');



// Set the views folder (optional, default is 'views')
app.set('views', path.join(__dirname, '/views'));



// Serve static files (like CSS, images, etc.) from the public folder
app.use(express.static(path.join(__dirname, '/views/public')));




// const crypto = require('crypto');

// const secret = process.env.Secret_key; // Your verification secret key
// const userId = current_user.id // A string UUID to identify your user

// const hash = crypto.createHmac('sha256', secret).update(userId).digest('hex');





app.get('/automations', (req, res) => {
    res.render('chatbot');
  });
app.get('/deal', (req, res) => {
    res.render('deal');
  });
// Rout

app.get('/', (req, res) => {
    res.render('index');
  });
// Route to send a new blog post to Airtable
app.post("/new-post", async (req, res) => {
    try {
        const { title, slug, content } = req.body;

        if (!title || !slug || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Send data to Airtable
        const response = await axios.post(
            AIRTABLE_URL,
            {
                records: [
                    {
                        fields: {
                            Title: title,
                            Slug: slug,
                            Content: content,
                            Date: new Date().toISOString(),
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Blog post added to Airtable");
        res.status(200).json({ message: "Post added to Airtable", data: response.data });

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
