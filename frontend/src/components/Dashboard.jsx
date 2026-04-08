import { useState, useEffect } from 'react'
import FilterSection from './FilterSection'
import StatsCards from './StatsCards'
import TransactionsTable from './TransactionsTable'
import Charts from './Charts'
import api from '../services/api'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    neighborhood: '',
    propertyType: '',
    priceMin: '',
    priceMax: '',
    dateStart: '',
    dateEnd: '',
    searchTerm: ''
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/transactions')
      setTransactions(response.data)
      setFilteredTransactions(response.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar transações. Tente novamente.')
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (activeFilters) => {
    let filtered = [...transactions]

    if (activeFilters.neighborhood) {
      filtered = filtered.filter(t =>
        t.neighborhood.toLowerCase().includes(activeFilters.neighborhood.toLowerCase())
      )
    }

    if (activeFilters.propertyType) {
      filtered = filtered.filter(t =>
        t.propertyType === activeFilters.propertyType
      )
    }

    if (activeFilters.priceMin) {
      filtered = filtered.filter(t =>
        t.price >= parseFloat(activeFilters.priceMin)
      )
    }

    if (activeFilters.priceMax) {
      filtered = filtered.filter(t =>
        t.price <= parseFloat(activeFilters.priceMax)
      )
    }

    if (activeFilters.dateStart) {
      filtered = filtered.filter(t =>
        new Date(t.transactionDate) >= new Date(activeFilters.dateStart)
      )
    }

    if (activeFilters.dateEnd) {
      filtered = filtered.filter(t =>
        new Date(t.transactionDate) <= new Date(activeFilters.dateEnd)
      )
    }

    if (activeFilters.searchTerm) {
      const term = activeFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(t =>
        t.address.toLowerCase().includes(term) ||
        t.neighborhood.toLowerCase().includes(term)
      )
    }

    setFilteredTransactions(filtered)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      neighborhood: '',
      propertyType: '',
      priceMin: '',
      priceMax: '',
      dateStart: '',
      dateEnd: '',
      searchTerm: ''
    }
    setFilters(clearedFilters)
    setFilteredTransactions(transactions)
  }

  return (
    <div className="container-dashboard">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <FilterSection
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filters={filters}
      />

      <StatsCards
        transactions={filteredTransactions}
        totalTransactions={transactions.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Charts transactions={filteredTransactions} />
      </div>

      <TransactionsTable
        transactions={filteredTransactions}
        loading={loading}
        totalResults={filteredTransactions.length}
      />
    </div>
  )
}
