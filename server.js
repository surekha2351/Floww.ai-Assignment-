const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// intilizing Database
const { initializeDatabase } = require("./src/database");

// importing routes
const userRoutes = require("./src/routes/usersRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

app.use(express.json());

// routes
app.use("/users", userRoutes);
app.use("/txn", transactionRoutes);

// intializing server
const initializingServer = async () => {
  try {
    await initializeDatabase(app);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Error initializing the server: ${error.message}`);
    process.exit(1);
  }
};

initializingServer();
