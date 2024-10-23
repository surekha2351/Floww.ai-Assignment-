// Add a new transaction for the authenticated user
const addingtransaction = async (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const userId = req.user.id;
  const db = req.app.locals.db;

  try {
    const categoryQuery = `SELECT id FROM categories WHERE id = ?`;
    const categoryResult = await db.get(categoryQuery, [category]);

    if (!categoryResult) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const query = `
        INSERT INTO transactions (user_id, type, category, amount, date, description) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    await db.run(query, [userId, type, category, amount, date, description]);

    res.status(201).json({ message: "Transaction added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding transaction", error: error.message });
  }
};

// Retrieve all transactions for the authenticated user
const getalltransaction = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.locals.db;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (pageNumber < 1 || limitNumber < 1) {
    return res
      .status(400)
      .json({ message: "Page and limit must be positive integers." });
  }

  const offset = (pageNumber - 1) * limitNumber;

  try {
    const countQuery = `SELECT COUNT(*) AS total FROM transactions WHERE user_id = ?`;
    const countResult = await db.get(countQuery, [userId]);
    const totalTransactions = countResult.total;

    const query = `SELECT * FROM transactions WHERE user_id = ? LIMIT ? OFFSET ?`;
    const transactions = await db.all(query, [userId, limitNumber, offset]);

    const totalPages = Math.ceil(totalTransactions / limitNumber);
    res.status(200).json({
      totalTransactions,
      totalPages,
      currentPage: pageNumber,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving transactions",
      error: error.message,
    });
  }
};

// Retrieve a specific transaction by ID for the authenticated user
const getbytransactionid = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const db = req.app.locals.db;

  try {
    const query = `SELECT * FROM transactions WHERE id = ? AND user_id = ?`;
    const transaction = await db.get(query, [id, userId]);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving transaction", error: error.message });
  }
};

// Update a specific transaction by ID for the authenticated user
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;
  const userId = req.user.id;
  const db = req.app.locals.db;

  try {
    const query = `
        UPDATE transactions
        SET type = ?, category = ?, amount = ?, date = ?, description = ?
        WHERE id = ? AND user_id = ?`;

    const result = await db.run(query, [
      type,
      category,
      amount,
      date,
      description,
      id,
      userId,
    ]);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    }

    res.status(200).json({ message: "Transaction updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating transaction", error: error.message });
  }
};

// Delete a transaction by ID for the authenticated user
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const db = req.app.locals.db;

  try {
    const query = `DELETE FROM transactions WHERE id = ? AND user_id = ?`;
    const result = await db.run(query, [id, userId]);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting transaction", error: error.message });
  }
};

// summary of user transactions
const getSummary = async (req, res) => {
  const { startDate, endDate, categoryName } = req.query;
  const db = req.app.locals.db;

  try {
    let categoryId = null;

    if (categoryName) {
      const categoryQuery = `SELECT id FROM categories WHERE name = ?`;
      const categoryResult = await db.get(categoryQuery, [categoryName]);
      if (categoryResult) {
        categoryId = categoryResult.id;
      } else {
        return res.status(400).json({ message: "Category does not exist" });
      }
    }

    let query = `
            SELECT 
                SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS totalExpenses
            FROM transactions t`;

    const queryParams = [];

    if (startDate || endDate || categoryId) {
      query += " WHERE";

      if (startDate) {
        query += " t.date >= ?";
        queryParams.push(startDate);
      }
      if (endDate) {
        query += ` AND t.date <= ?`;
        queryParams.push(endDate);
      }

      if (categoryId) {
        query += ` AND t.category = ?`;
        queryParams.push(categoryId);
      }
    }

    const summary = await db.get(query, queryParams);
    const balance = (summary.totalIncome || 0) - (summary.totalExpenses || 0);

    res.status(200).json({
      totalIncome: summary.totalIncome || 0,
      totalExpenses: summary.totalExpenses || 0,
      balance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving summary", error: error.message });
  }
};

module.exports = {
  addingtransaction,
  getalltransaction,
  getbytransactionid,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
