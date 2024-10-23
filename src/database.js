const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

// Path of SQLite database
const dbpath = path.join(__dirname, "personal_expense.db");

// Pass app instance to the function to set the db connection
const initializeDatabase = async (app) => {
  const db = await open({ filename: dbpath, driver: sqlite3.Database });
  app.locals.db = db; // Store the db connection in app.locals

  // Create tables if they do not already exist
  await createUsersTable(db);
  await createCategoriesTable(db);
  await createTransactionsTable(db);

  return db; // Return the db connection for later use
};

// Function to create users table
const createUsersTable = async (db) => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error(`Error creating users table: ${error.message}`);
  }
};

// Function to create categories table
const createCategoriesTable = async (db) => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
      );
    `);
  } catch (error) {
    console.error(`Error creating categories table: ${error.message}`);
  }
};

// Function to create transactions table
const createTransactionsTable = async (db) => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,  -- Foreign key reference to users table
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        category INTEGER NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (category) REFERENCES categories(id)
      );
    `);
  } catch (error) {
    console.error(`Error creating transactions table: ${error.message}`);
  }
};

module.exports = { initializeDatabase };
