require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_form_builder_key_2026";

// 🔗 PostgreSQL connection
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      user: "postgres",
      host: "localhost",
      database: "form_db",
      password: "admin1234",
      port: 5432,
    });

// ⚡ Automatically initialize database tables if they do not exist
const initDb = async () => {
  try {
    // 1. Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create forms table with user_id
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forms (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        questions JSONB DEFAULT '[]'::jsonb,
        slug TEXT UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Alter forms table in case it was created without user_id before
    await pool.query(`
      ALTER TABLE forms ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
    `);
    
    // 4. Create responses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        form_id TEXT NOT NULL,
        answers JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database tables initialized successfully 🚀");
  } catch (err) {
    console.error("Database initialization error ❌:", err.message);
  }
};
initDb();

// 🔒 Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// ✅ Home route
app.get("/", (req, res) => {
  res.send("Backend + DB working 🚀");
});

// 🔑 Authentication Routes
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userExist = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase().trim()]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email.toLowerCase().trim(), hashedPassword]
    );

    const user = newUser.rows[0];

    // Auto-migrate existing forms to first user
    const totalUsers = await pool.query("SELECT count(*) FROM users");
    if (parseInt(totalUsers.rows[0].count, 10) === 1) {
      await pool.query("UPDATE forms SET user_id = $1 WHERE user_id IS NULL", [user.id]);
      console.log(`Migrated existing forms to the first user: ${user.name}`);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all forms (Protected - user only sees their own forms)
app.get("/api/forms", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM forms WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching forms");
  }
});

// ✅ POST create form (Protected)
app.post("/api/forms", authenticateToken, async (req, res) => {
  console.log("🔥 POST /api/forms HIT by user:", req.user.id);
  const { title, description, questions } = req.body;

  const slug =
    title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') +
    '-' +
    Date.now();

  try {
    const result = await pool.query(
      "INSERT INTO forms (title, description, questions, slug, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, JSON.stringify(questions), slug, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT update form (Protected - verifies ownership)
app.put("/api/forms/:formId", authenticateToken, async (req, res) => {
  console.log("🔥 PUT /api/forms/:formId HIT");
  const { formId } = req.params;
  const { title, description, questions } = req.body;

  try {
    const result = await pool.query(
      "UPDATE forms SET title = $1, description = $2, questions = $3 WHERE (id = $4 OR slug = $5) AND user_id = $6 RETURNING *",
      [title, description, JSON.stringify(questions), isNaN(Number(formId)) ? -1 : Number(formId), formId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Form not found or access denied");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single form (Public - anyone can view to fill out)
app.get("/api/forms/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    let result = await pool.query(
      "SELECT * FROM forms WHERE slug = $1",
      [slug]
    );

    if (result.rows.length === 0) {
      const id = parseInt(slug, 10);
      if (!isNaN(id)) {
        result = await pool.query(
          "SELECT * FROM forms WHERE id = $1",
          [id]
        );
      }
    }

    if (result.rows.length === 0) {
      return res.status(404).send("Form not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching form");
  }
});

// ✅ DELETE form (Protected - verifies ownership)
app.delete("/api/forms/:formId", authenticateToken, async (req, res) => {
  const { formId } = req.params;
  console.log("🔥 DELETE /api/forms/:formId HIT:", formId);

  try {
    const checkForm = await pool.query(
      "SELECT id FROM forms WHERE (id = $1 OR slug = $2) AND user_id = $3",
      [isNaN(Number(formId)) ? -1 : Number(formId), formId, req.user.id]
    );
    
    if (checkForm.rows.length === 0) {
      return res.status(403).json({ error: "Form not found or access denied" });
    }

    const dbFormId = checkForm.rows[0].id;

    // 1. Delete associated responses first
    await pool.query("DELETE FROM responses WHERE form_id = $1 OR form_id = $2", [formId, String(dbFormId)]);

    // 2. Delete the form itself
    const result = await pool.query(
      "DELETE FROM forms WHERE id = $1 RETURNING *",
      [dbFormId]
    );

    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST submit responses (Public - anyone can submit)
app.post("/api/forms/:formId/submit", async (req, res) => {
  const { formId } = req.params;
  const { answers } = req.body;
  console.log("🔥 POST submit responses HIT:", formId);

  try {
    const result = await pool.query(
      "INSERT INTO responses (form_id, answers) VALUES ($1, $2) RETURNING *",
      [formId, JSON.stringify(answers)]
    );
    res.json({ success: true, response: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all responses for a form (Protected - only owner can view)
app.get("/api/forms/:formId/responses", authenticateToken, async (req, res) => {
  const { formId } = req.params;
  console.log("🔥 GET responses HIT:", formId);

  try {
    const checkForm = await pool.query(
      "SELECT id FROM forms WHERE (id = $1 OR slug = $2) AND user_id = $3",
      [isNaN(Number(formId)) ? -1 : Number(formId), formId, req.user.id]
    );

    if (checkForm.rows.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    const dbFormId = checkForm.rows[0].id;

    const result = await pool.query(
      "SELECT * FROM responses WHERE form_id = $1 OR form_id = $2 ORDER BY created_at DESC",
      [formId, String(dbFormId)]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Backward compatible fallback routes
app.post("/api/responses", async (req, res) => {
  const { form_id, answers } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO responses (form_id, answers) VALUES ($1, $2) RETURNING *",
      [form_id, JSON.stringify(answers)]
    );
    res.json({ success: true, response: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});