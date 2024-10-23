const express = require("express");
const router = express.Router();
const transactionRoutes = require("../Controllers/transactionControllers");
const authMiddleware = require("../middleware/authMiddleware");

// Adding transaction (protected)
router.post(
  "/transaction",
  authMiddleware,
  transactionRoutes.addingtransaction
);

// Retrieving all the transactions of a user (protected)
router.get(
  "/alltransaction",
  authMiddleware,
  transactionRoutes.getalltransaction
);

// Retrieving a specific transaction by transaction id (protected)
router.get(
  "/transactionbyid/:id",
  authMiddleware,
  transactionRoutes.getbytransactionid
);

// Updating a transaction by transaction id (protected)
router.put(
  "/updatetransaction/:id",
  authMiddleware,
  transactionRoutes.updateTransaction
);

// Deleting a transaction by transaction id (protected)
router.delete(
  "/deletetransaction/:id",
  authMiddleware,
  transactionRoutes.deleteTransaction
);

// summary
router.get("/summary", authMiddleware, transactionRoutes.getSummary);

module.exports = router;
