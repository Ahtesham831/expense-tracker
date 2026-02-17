import { useState } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other']

export default function ExpenseList({ expenses, filters, onFilterChange, onExpenseDeleted }) {

    const handleSortToggle = () => {
        // Toggle beween 'date_desc' and 'date_asc'
        const newSort = filters.sort === 'date_desc' ? 'date_asc' : 'date_desc'
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

                <button onClick={handleSortToggle} style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
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
                                <th>Action</th>
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
                                            backgroundColor: 'var(--item-bg)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.8em',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="amount">₹{expense.amount.toLocaleString('en-IN')}</td>
                                    <td>
                                        <button
                                            onClick={() => onExpenseDeleted(expense._id)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: 'var(--error-color)',
                                                padding: '4px',
                                                boxShadow: 'none',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title="Delete Expense"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
