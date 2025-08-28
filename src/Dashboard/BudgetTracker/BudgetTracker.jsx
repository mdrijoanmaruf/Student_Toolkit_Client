import React, { useState } from 'react'
import { 
  HiCurrencyDollar, 
  HiPlus, 
  HiMinus, 
  HiTrendingUp, 
  HiTrendingDown,
  HiShoppingCart,
  HiAcademicCap,
  HiHome
} from 'react-icons/hi'

const BudgetTracker = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 25, category: 'Food', description: 'Lunch at cafeteria', date: '2025-08-28' },
    { id: 2, type: 'income', amount: 500, category: 'Allowance', description: 'Monthly allowance', date: '2025-08-01' },
    { id: 3, type: 'expense', amount: 45, category: 'Books', description: 'Programming textbook', date: '2025-08-15' }
  ])

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  })

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const handleAddTransaction = () => {
    if (newTransaction.amount && newTransaction.category && newTransaction.description) {
      setTransactions([
        ...transactions,
        {
          id: Date.now(),
          ...newTransaction,
          amount: parseFloat(newTransaction.amount),
          date: new Date().toISOString().split('T')[0]
        }
      ])
      setNewTransaction({
        type: 'expense',
        amount: '',
        category: '',
        description: ''
      })
    }
  }

  const categoryIcons = {
    'Food': HiShoppingCart,
    'Books': HiAcademicCap,
    'Housing': HiHome,
    'Allowance': HiCurrencyDollar
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <HiCurrencyDollar className="w-8 h-8 text-green-400" />
        <h1 className="text-3xl font-bold text-white">Budget Tracker</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold text-white">${totalIncome}</p>
            </div>
            <HiTrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-white">${totalExpenses}</p>
            </div>
            <HiTrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className={`${balance >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-orange-500/10 border-orange-500/20'} border rounded-2xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${balance >= 0 ? 'text-blue-400' : 'text-orange-400'} text-sm font-medium`}>Balance</p>
              <p className="text-3xl font-bold text-white">${balance}</p>
            </div>
            <HiCurrencyDollar className={`w-8 h-8 ${balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Add Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={handleAddTransaction}
          className="mt-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center space-x-2"
        >
          <HiPlus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const IconComponent = categoryIcons[transaction.category] || HiCurrencyDollar
            return (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.description}</p>
                    <p className="text-gray-400 text-sm">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <div className={`text-lg font-semibold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BudgetTracker