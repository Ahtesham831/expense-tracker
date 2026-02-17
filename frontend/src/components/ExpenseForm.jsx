import { useState, useEffect } from 'react'
import axios from 'axios'

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other']

export default function ExpenseForm({ onExpenseAdded }) {
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food', // Default
        description: '',
        date: new Date().toISOString().split('T')[0] // Today
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [idempotencyKey, setIdempotencyKey] = useState('')

    useEffect(() => {
        // Generate initial key
        setIdempotencyKey(crypto.randomUUID())
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await axios.post('/expenses', {
                ...formData,
                amount: Number(formData.amount)
            }, {
                headers: {
                    'Idempotency-Key': idempotencyKey
                }
            })

            // Success
            onExpenseAdded()

            // Reset form and generate new key
            setFormData({
                amount: '',
                category: 'Food',
                description: '',
                date: new Date().toISOString().split('T')[0]
            })
            setIdempotencyKey(crypto.randomUUID())

        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || 'Failed to add expense. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
                <label className="text-sm text-secondary" style={{ marginBottom: 4 }}><strong>Amount (₹)</strong></label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-secondary" style={{ marginBottom: 4 }}><strong>Category</strong></label>
                <select name="category" value={formData.category} onChange={handleChange}>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-secondary" style={{ marginBottom: 4 }}><strong>Description</strong></label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What was this for?"
                    rows="3"
                    style={{ resize: 'vertical' }}
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-secondary" style={{ marginBottom: 4 }}><strong>Date</strong></label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
                {loading ? 'Adding...' : 'Add Expense'}
            </button>
        </form>
    )
}
