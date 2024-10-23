const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "Floww.ai";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

// Register route
const register = async (req, res) => {
  const { username, password, email } = req.body;
  const db = req.app.locals.db;

  if (!username || !password || !email) {
    return res.status(400).send("Username, email, and password are required.");
  }

  try {
    const existingUser = await db.get(
      "SELECT * FROM Users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser) {
      const errors = [];

      if (existingUser.username === username) {
        errors.push("Username already exists");
      }

      if (existingUser.email === email) {
        errors.push("Email already exists");
      }

      if (errors.length) {
        return res.status(400).send(errors.join(", "));
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Login route
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const db = req.app.locals.db;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    const user = await db.get("SELECT * FROM Users WHERE username = ?", [
      username,
    ]);

    if (!user) {
      return res.status(401).send("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.json({ token });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { register, loginUser };
