import { useState } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other']

export default function ExpenseList({ expenses, filters, onFilterChange }) {

    const handleSortToggle = () => {
        // Toggle beween 'date_desc' and ''
        const newSort = filters.sort === 'date_desc' ? '' : 'date_desc'
        onFilterChange({ sort: newSort })
    }

    const handleCategoryChange = (e) => {
        onFilterChange({ category: e.target.value })
    }

    return (
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div className="flex items-center">
                    <label style={{ marginRight: '0.5rem', color: 'var(--text-secondary)' }}>Filter:</label>
                    <select
                        value={filters.category}
                        onChange={handleCategoryChange}
                        style={{ width: 'auto', marginBottom: 0 }}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <button onClick={handleSortToggle} style={{ backgroundColor: 'var(--surface-color)', border: '1px solid #404040', color: 'var(--text-primary)' }}>
                    {filters.sort === 'date_desc' ? 'Sort: Oldest First' : 'Sort: Newest First'}
                </button>
            </div>

            {expenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No expenses found.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense._id}>
                                    <td>{new Date(expense.date).toLocaleDateString('en-IN')}</td>
                                    <td>{expense.description}</td>
                                    <td>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: '#333',
                                            fontSize: '0.8em'
                                        }}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="amount">₹{expense.amount.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
