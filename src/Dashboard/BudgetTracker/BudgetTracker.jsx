import React, { useState, useEffect } from 'react'
import { 
  HiCurrencyDollar, 
  HiPlus, 
  HiMinus, 
  HiTrendingUp, 
  HiTrendingDown,
  HiShoppingCart,
  HiAcademicCap,
  HiHome,
  HiTrash,
  HiPencil
} from 'react-icons/hi'
import useAuth from '../../Hook/useAuth'
import useAxios from '../../Hook/useAxios'
import Swal from 'sweetalert2'

const BudgetTracker = () => {
  const { user } = useAuth()
  const axiosSecure = useAxios()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  })

  // Predefined categories for better UX
  const expenseCategories = ['Food', 'Books', 'Transportation', 'Housing', 'Entertainment', 'Health', 'Other']
  const incomeCategories = ['Allowance', 'Job', 'Scholarship', 'Gift', 'Other']

  // Fetch transactions from API
  const fetchTransactions = async () => {
    if (!user?.uid) return
    
    try {
      const response = await axiosSecure.get(`/api/transactions/${user.uid}`)
      const data = response.data
      
      if (data.success) {
        setTransactions(data.data)
      } else {
        console.error('Error fetching transactions:', data.message)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add new transaction
  const handleAddTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) {
      await Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all fields',
        icon: 'warning',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea'
      });
      return
    }

    setSubmitting(true)
    try {
      const response = await axiosSecure.post('/api/transactions', {
        userId: user.uid,
        ...newTransaction
      })

      const data = response.data
      
      if (data.success) {
        setTransactions([data.data, ...transactions])
        setNewTransaction({
          type: 'expense',
          amount: '',
          category: '',
          description: ''
        })
        
        await Swal.fire({
          title: 'Success!',
          text: 'Transaction added successfully',
          icon: 'success',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#10b981',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await Swal.fire({
          title: 'Error!',
          text: 'Error adding transaction: ' + data.message,
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to add transaction. Please try again.',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSubmitting(false)
    }
  }

  // Edit transaction
  const handleEditTransaction = async (transaction) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Transaction',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select id="editType" class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="expense" ${transaction.type === 'expense' ? 'selected' : ''}>Expense</option>
              <option value="income" ${transaction.type === 'income' ? 'selected' : ''}>Income</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Amount (BDT)</label>
            <input id="editAmount" type="number" value="${transaction.amount}" class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Amount">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select id="editCategory" class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              ${(transaction.type === 'expense' ? expenseCategories : incomeCategories).map(cat => 
                `<option value="${cat}" ${cat === transaction.category ? 'selected' : ''}>${cat}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <input id="editDescription" type="text" value="${transaction.description}" class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Description">
          </div>
        </div>
      `,
      background: '#1f2937',
      color: '#f9fafb',
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#6b7280',
      showCancelButton: true,
      confirmButtonText: 'Update Transaction',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const type = document.getElementById('editType').value
        const amount = document.getElementById('editAmount').value
        const category = document.getElementById('editCategory').value
        const description = document.getElementById('editDescription').value
        
        if (!amount || !category || !description) {
          Swal.showValidationMessage('Please fill in all fields')
        }
        
        return { type, amount, category, description }
      }
    })

    if (formValues) {
      try {
        const response = await axiosSecure.put(`/api/transactions/${transaction._id}`, formValues)

        const data = response.data
        
        if (data.success) {
          // Update the transaction in the local state
          setTransactions(transactions.map(t => 
            t._id === transaction._id 
              ? { ...t, ...formValues, amount: parseFloat(formValues.amount) }
              : t
          ))
          
          await Swal.fire({
            title: 'Success!',
            text: 'Transaction updated successfully',
            icon: 'success',
            background: '#1f2937',
            color: '#f9fafb',
            confirmButtonColor: '#10b981',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Error updating transaction: ' + data.message,
            icon: 'error',
            background: '#1f2937',
            color: '#f9fafb',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        console.error('Error updating transaction:', error)
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to update transaction. Please try again.',
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  }

  // Delete transaction
  const handleDeleteTransaction = async (transactionId) => {
    const result = await Swal.fire({
      title: 'Delete Transaction?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      background: '#1f2937',
      color: '#f9fafb',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/api/transactions/${transactionId}`)

        const data = response.data
        
        if (data.success) {
          setTransactions(transactions.filter(t => t._id !== transactionId))
          
          await Swal.fire({
            title: 'Deleted!',
            text: 'Transaction has been deleted successfully',
            icon: 'success',
            background: '#1f2937',
            color: '#f9fafb',
            confirmButtonColor: '#10b981',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Error deleting transaction: ' + data.message,
            icon: 'error',
            background: '#1f2937',
            color: '#f9fafb',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        console.error('Error deleting transaction:', error)
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete transaction. Please try again.',
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user])

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const categoryIcons = {
    'Food': HiShoppingCart,
    'Books': HiAcademicCap,
    'Housing': HiHome,
    'Transportation': HiCurrencyDollar,
    'Entertainment': HiCurrencyDollar,
    'Health': HiCurrencyDollar,
    'Allowance': HiCurrencyDollar,
    'Job': HiCurrencyDollar,
    'Scholarship': HiAcademicCap,
    'Gift': HiCurrencyDollar,
    'Other': HiCurrencyDollar
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <HiCurrencyDollar className="w-8 h-8 text-green-400 mx-auto sm:mx-0" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">Budget Tracker</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-xs sm:text-sm font-medium">Total Income</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">৳{totalIncome.toLocaleString()}</p>
            </div>
            <HiTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-xs sm:text-sm font-medium">Total Expenses</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">৳{totalExpenses.toLocaleString()}</p>
            </div>
            <HiTrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
          </div>
        </div>

        <div className={`${balance >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-orange-500/10 border-orange-500/20'} border rounded-2xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${balance >= 0 ? 'text-blue-400' : 'text-orange-400'} text-xs sm:text-sm font-medium`}>Balance</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">৳{balance.toLocaleString()}</p>
            </div>
            <HiCurrencyDollar className={`w-6 h-6 sm:w-8 sm:h-8 ${balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700/50">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Add Transaction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value, category: ''})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            placeholder="Amount (BDT)"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />

          <select
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="">Select Category</option>
            {(newTransaction.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base sm:col-span-2 lg:col-span-1"
          />
        </div>
        <button
          onClick={handleAddTransaction}
          disabled={submitting}
          className="mt-4 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center justify-center sm:justify-start space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <HiPlus className="w-4 h-4" />
          <span>{submitting ? 'Adding...' : 'Add Transaction'}</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700/50">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <HiCurrencyDollar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base px-4">No transactions yet. Add your first transaction above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const IconComponent = categoryIcons[transaction.category] || HiCurrencyDollar
              return (
                <div key={transaction._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors group space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{transaction.category} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                    <div className={`text-base sm:text-lg font-semibold flex-shrink-0 ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="p-1.5 sm:p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                        title="Edit transaction"
                      >
                        <HiPencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Delete transaction"
                      >
                        <HiTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetTracker