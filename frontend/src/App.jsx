import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({ category: '', sort: 'date_desc' })

    const fetchExpenses = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = {}
            if (filters.category) params.category = filters.category
            if (filters.sort) params.sort = filters.sort

            const response = await axios.get('/expenses', { params })
            setExpenses(response.data)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch expenses. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    const handleExpenseAdded = (newExpense) => {
        // Optimistically update or refetch
        // For simplicity and correctness with sorting/filtering, refetching is safer
        // but we can also append/prepend based on sort.
        // Let's refetch to ensure consistency with backend sort/filter
        fetchExpenses()
    }

    const handleExpenseDeleted = async (id) => {
        try {
            await axios.delete(`/expenses/${id}`)
            // Remove from local state to update UI and Total immediately without refetching everything
            setExpenses(prev => prev.filter(expense => expense._id !== id))
        } catch (err) {
            console.error(err)
            setError('Failed to delete expense. Please try again.')
        }
    }

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    return (
        <div>
            <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <h1>💰 Expense Tracker</h1>
                <div className="card" style={{ padding: '0.5rem 1rem', margin: 0 }}>
                    <span className="text-secondary">Total: </span>
                    <span className="amount" style={{ fontSize: '1.2em' }}>
                        ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                </div>
            </header>

            <main>
                <div className="card">
                    <h2>Add New Expense</h2>
                    <ExpenseForm onExpenseAdded={handleExpenseAdded} />
                </div>

                <div className="card">
                    <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                        <h2>Expenses</h2>
                        {loading && <span className="text-secondary text-sm">Refreshing...</span>}
                    </div>

                    {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

                    <ExpenseList
                        expenses={expenses}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onExpenseDeleted={handleExpenseDeleted}
                    />
                </div>
            </main>
        </div>
    )
}

export default App
