import { useState } from 'react'

export default function TransactionsTable({ transactions, loading, totalResults }) {
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aVal, bVal

    switch (sortBy) {
      case 'price':
        aVal = a.price
        bVal = b.price
        break
      case 'date':
        aVal = new Date(a.transactionDate)
        bVal = new Date(b.transactionDate)
        break
      case 'address':
        aVal = a.address.toLowerCase()
        bVal = b.address.toLowerCase()
        break
      default:
        return 0
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    }
    return aVal < bVal ? 1 : -1
  })

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <span className="text-gray-400">⇅</span>
    return sortOrder === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Transações Imobiliárias</h2>
        <span className="text-sm text-gray-600">
          {totalResults} {totalResults === 1 ? 'transação' : 'transações'}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando transações...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma transação encontrada com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('address')}
                    className="font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-1"
                  >
                    Endereço
                    <SortIcon column="address" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="font-semibold text-gray-700">Bairro</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="font-semibold text-gray-700">Tipo</span>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('price')}
                    className="font-semibold text-gray-700 hover:text-blue-600 flex items-center justify-end gap-1 w-full"
                  >
                    Preço
                    <SortIcon column="price" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('date')}
                    className="font-semibold text-gray-700 hover:text-blue-600 flex items-center justify-center gap-1 w-full"
                  >
                    Data
                    <SortIcon column="date" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {transaction.address}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {transaction.neighborhood}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {transaction.propertyType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-right">
                    {formatCurrency(transaction.price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {formatDate(transaction.transactionDate)}
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
