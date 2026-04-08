import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
)

export default function Charts({ transactions }) {
  const priceByType = useMemo(() => {
    const byType = {}
    transactions.forEach(t => {
      if (!byType[t.propertyType]) {
        byType[t.propertyType] = []
      }
      byType[t.propertyType].push(t.price)
    })

    return Object.entries(byType).map(([type, prices]) => ({
      type,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      count: prices.length
    }))
  }, [transactions])

  const priceByNeighborhood = useMemo(() => {
    const byNeighborhood = {}
    transactions.slice(0, 10).forEach(t => {
      if (!byNeighborhood[t.neighborhood]) {
        byNeighborhood[t.neighborhood] = []
      }
      byNeighborhood[t.neighborhood].push(t.price)
    })

    return Object.entries(byNeighborhood).map(([neighborhood, prices]) => ({
      neighborhood,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    }))
  }, [transactions])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    }
  }

  return (
    <>
      {/* Preço Médio por Tipo de Imóvel */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Preço Médio por Tipo</h3>
        {priceByType.length > 0 ? (
          <Bar
            data={{
              labels: priceByType.map(p => p.type),
              datasets: [{
                label: 'Preço Médio (R$)',
                data: priceByType.map(p => p.avgPrice),
                backgroundColor: [
                  'rgba(59, 130, 246, 0.7)',
                  'rgba(34, 197, 94, 0.7)',
                  'rgba(249, 115, 22, 0.7)',
                  'rgba(168, 85, 247, 0.7)',
                  'rgba(236, 72, 153, 0.7)',
                  'rgba(14, 165, 233, 0.7)'
                ],
                borderColor: [
                  'rgb(59, 130, 246)',
                  'rgb(34, 197, 94)',
                  'rgb(249, 115, 22)',
                  'rgb(168, 85, 247)',
                  'rgb(236, 72, 153)',
                  'rgb(14, 165, 233)'
                ],
                borderWidth: 1
              }]
            }}
            options={chartOptions}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
        )}
      </div>

      {/* Distribuição por Tipo de Imóvel */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Tipo</h3>
        {priceByType.length > 0 ? (
          <Pie
            data={{
              labels: priceByType.map(p => `${p.type} (${p.count})`),
              datasets: [{
                data: priceByType.map(p => p.count),
                backgroundColor: [
                  'rgba(59, 130, 246, 0.7)',
                  'rgba(34, 197, 94, 0.7)',
                  'rgba(249, 115, 22, 0.7)',
                  'rgba(168, 85, 247, 0.7)',
                  'rgba(236, 72, 153, 0.7)',
                  'rgba(14, 165, 233, 0.7)'
                ],
                borderColor: [
                  'rgb(59, 130, 246)',
                  'rgb(34, 197, 94)',
                  'rgb(249, 115, 22)',
                  'rgb(168, 85, 247)',
                  'rgb(236, 72, 153)',
                  'rgb(14, 165, 233)'
                ],
                borderWidth: 2
              }]
            }}
            options={chartOptions}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
        )}
      </div>
    </>
  )
}
