import React, { useMemo } from 'react';

export default function CategorySummary({ expenses }) {
    const categoryTotals = useMemo(() => {
        const totals = {};
        expenses.forEach(expense => {
            if (!totals[expense.category]) {
                totals[expense.category] = 0;
            }
            totals[expense.category] += expense.amount;
        });
        return totals;
    }, [expenses]);

    const categories = Object.keys(categoryTotals).sort();

    if (categories.length === 0) return null;

    return (
        <div className="card">
            <h2>Category Breakdown</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {categories.map(category => (
                    <div key={category} style={{
                        backgroundColor: 'var(--item-bg)',
                        padding: '1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        border: '1px solid var(--border-color)'
                    }}>
                        <span className="text-secondary" style={{ fontSize: '0.9em', marginBottom: '0.5rem' }}>{category}</span>
                        <span className="amount" style={{ fontSize: '1.1em' }}>
                            ₹{categoryTotals[category].toLocaleString('en-IN')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
