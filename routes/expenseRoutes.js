const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { create, update, getById, delete: deleteValidator } = require('../utils/validators');

// Routes
router.route('/')
    .get(expenseController.getExpenses)      // GET /api/expenses
    .post(create, expenseController.createExpense);  // POST /api/expenses

router.get('/summary/stats', expenseController.getSummary);  // GET /api/expenses/summary/stats

router.route('/:id')
    .get(getById, expenseController.getExpenseById)      // GET /api/expenses/:id
    .put(update, expenseController.updateExpense)      // PUT /api/expenses/:id
    .delete(deleteValidator, expenseController.deleteExpense);  // DELETE /api/expenses/:id

module.exports = router;
