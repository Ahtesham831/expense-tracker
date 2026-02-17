const express = require('express');
const router = express.Router();
const Expense = require('./models/Expense');
const Idempotency = require('./models/Idempotency');

// POST /expenses - Create a new expense
router.post('/', async (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        return res.status(400).json({ error: 'Idempotency-Key header is required' });
    }

    try {
        // Check for existing idempotency key
        const existingKey = await Idempotency.findOne({ key: idempotencyKey });
        if (existingKey) {
            return res.status(existingKey.statusCode).json(existingKey.response);
        }

        const { amount, category, description, date } = req.body;

        // Validation
        if (!amount || amount < 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }
        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }
        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const newExpense = new Expense({
            amount,
            category,
            description,
            date: new Date(date)
        });

        await newExpense.save();

        const responseBody = newExpense.toObject();
        const statusCode = 201;

        // Save idempotency key
        await Idempotency.create({
            key: idempotencyKey,
            response: responseBody,
            statusCode: statusCode
        });

        res.status(statusCode).json(responseBody);
    } catch (err) {
        console.error('Error creating expense:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /expenses - List expenses with filter and sort
router.get('/', async (req, res) => {
    try {
        const { category, sort } = req.query;

        let query = {};
        if (category) {
            query.category = category;
        }

        let dbQuery = Expense.find(query);

        if (sort === 'date_desc') {
            dbQuery = dbQuery.sort({ date: -1 });
        } else if (sort === 'date_asc') {
            dbQuery = dbQuery.sort({ date: 1 });
        } else {
            // Default to newest first if no sort specified? 
            // Or leave as natural order. Let's make newest first the default if nothing specified to be safe/consistent.
            dbQuery = dbQuery.sort({ date: -1 });
        }

        const expenses = await dbQuery.exec();
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /expenses/:id - Delete an expense
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
