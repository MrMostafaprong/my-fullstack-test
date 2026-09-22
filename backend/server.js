const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");

const app = express();

app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// إنشاء الجدول عند الحاجة
async function initDatabase() {
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
}

app.get("/", (req, res) => {
    res.json({
        message: "Backend + Database is online 🚀"
    });
});

// GET - كل المنتجات
app.get("/api/products", async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY id DESC
        `;

        res.json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

// POST - إضافة منتج
app.post("/api/products", async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                error: "name and price are required"
            });
        }

        const [product] = await sql`
            INSERT INTO products (name, price)
            VALUES (${name}, ${price})
            RETURNING *
        `;

        res.status(201).json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

const PORT = process.env.PORT || 3000;

initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
