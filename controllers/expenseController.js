const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');

// @desc    Get all expenses with optional filtering
// @route   GET /api/expenses
// @access  Public
const getExpenses = async (req, res, next) => {
    try {
        const { category, startDate, endDate, minAmount, maxAmount, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (category) filter.category = category;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = parseFloat(minAmount);
            if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const expenses = await Expense.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Expense.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: expenses.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: expenses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Public
const getExpenseById = async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const expense = await Expense.findById(req.params.id);
        
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: `Expense not found with id: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public
const createExpense = async (req, res, next) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const expense = await Expense.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public
const updateExpense = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: `Expense not found with id: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
const deleteExpense = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: `Expense not found with id: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get expense summary/statistics
// @route   GET /api/expenses/summary/stats
// @access  Public
const getSummary = async (req, res, next) => {
    try {
        const stats = await Expense.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        const overallTotal = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                byCategory: stats,
                overallTotal: overallTotal[0]?.total || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getSummary
};
