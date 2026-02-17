const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cors = require('cors');
const expenseRoutes = require('../routes');
const Idempotency = require('../models/Idempotency');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/expenses', expenseRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

describe('Expense API', () => {
    it('should create a new expense', async () => {
        const res = await request(app)
            .post('/expenses')
            .set('Idempotency-Key', 'key-1')
            .send({
                amount: 100,
                category: 'Food',
                description: 'Lunch',
                date: '2023-10-27'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.amount).toEqual(100);
        expect(res.body).toHaveProperty('_id');
    });

    it('should be idempotent (return same response on retry)', async () => {
        const payload = {
            amount: 50,
            category: 'Transport',
            description: 'Bus',
            date: '2023-10-28'
        };
        const key = 'key-retry-test';

        // First request
        const res1 = await request(app)
            .post('/expenses')
            .set('Idempotency-Key', key)
            .send(payload);

        expect(res1.statusCode).toEqual(201);

        // Second request (Retry)
        const res2 = await request(app)
            .post('/expenses')
            .set('Idempotency-Key', key)
            .send(payload);

        expect(res2.statusCode).toEqual(201);
        expect(res2.body).toEqual(res1.body); // Should be exact same response

        // Verify only one entry in DB
        const count = await mongoose.model('Expense').countDocuments();
        expect(count).toEqual(1);
    });

    it('should list expenses', async () => {
        await mongoose.model('Expense').create({
            amount: 200,
            category: 'Utilities',
            description: 'Bill',
            date: new Date('2023-10-26')
        });

        const res = await request(app).get('/expenses');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });

    it('should filter expenses by category', async () => {
        await mongoose.model('Expense').insertMany([
            { amount: 10, category: 'Food', description: 'Snack', date: new Date() },
            { amount: 20, category: 'Transport', description: 'Ticket', date: new Date() }
        ]);

        const res = await request(app).get('/expenses?category=Food');
        expect(res.body.length).toEqual(1);
        expect(res.body[0].category).toEqual('Food');
    });

    // Note: sorting test might be flaky if dates are identical, but good enough for now
});
