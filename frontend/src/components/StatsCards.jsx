export default function StatsCards({ transactions, totalTransactions }) {
  const calculateStats = () => {
    if (transactions.length === 0) {
      return {
        avgPrice: 0,
        totalVolume: 0,
        medianPrice: 0,
        count: 0
      }
    }

    const prices = transactions.map(t => t.price).sort((a, b) => a - b)
    const totalPrice = prices.reduce((sum, price) => sum + price, 0)
    const avgPrice = totalPrice / prices.length
    const medianPrice = prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)]

    return {
      avgPrice: Math.round(avgPrice),
      totalVolume: Math.round(totalPrice),
      medianPrice: Math.round(medianPrice),
      count: transactions.length
    }
  }

  const stats = calculateStats()

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="stat-card blue">
        <div className="text-gray-600 text-sm font-medium">Transações Encontradas</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">{stats.count}</div>
        <div className="text-gray-500 text-xs mt-1">
          de {totalTransactions} total
        </div>
      </div>

      <div className="stat-card green">
        <div className="text-gray-600 text-sm font-medium">Preço Médio</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">
          {formatCurrency(stats.avgPrice)}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          Valor médio
        </div>
      </div>

      <div className="stat-card orange">
        <div className="text-gray-600 text-sm font-medium">Preço Mediano</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">
          {formatCurrency(stats.medianPrice)}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          50º percentil
        </div>
      </div>

      <div className="stat-card purple">
        <div className="text-gray-600 text-sm font-medium">Volume Total</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">
          {formatCurrency(stats.totalVolume)}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          Valor agregado
        </div>
      </div>
    </div>
  )
}
