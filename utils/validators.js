const { body, param } = require('express-validator');

const expenseValidation = {
    create: [
        body('title')
            .trim()
            .notEmpty().withMessage('Title is required')
            .isLength({ max: 100 }).withMessage('Title max 100 characters'),
        body('amount')
            .notEmpty().withMessage('Amount is required')
            .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
        body('category')
            .optional()
            .isIn(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'])
            .withMessage('Invalid category'),
        body('date')
            .optional()
            .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),
        body('paymentMethod')
            .optional()
            .isIn(['Cash', 'Credit Card', 'Debit Card', 'Mobile Money', 'Bank Transfer'])
            .withMessage('Invalid payment method')
    ],
    update: [
        param('id')
            .isMongoId().withMessage('Invalid expense ID format'),
        body('title')
            .optional()
            .trim()
            .isLength({ max: 100 }).withMessage('Title max 100 characters'),
        body('amount')
            .optional()
            .isFloat({ min: 0 }).withMessage('Amount must be positive'),
        body('category')
            .optional()
            .isIn(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'])
    ],
    getById: [
        param('id')
            .isMongoId().withMessage('Invalid expense ID format')
    ],
    delete: [
        param('id')
            .isMongoId().withMessage('Invalid expense ID format')
    ]
};

module.exports = expenseValidation;