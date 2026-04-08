import { useState } from 'react'

export default function FilterSection({ onFilterChange, onClearFilters, filters }) {
  const [isOpen, setIsOpen] = useState(true)

  const propertyTypes = [
    'Apartamento',
    'Casa',
    'Lote',
    'Comercial',
    'Industrial',
    'Outro'
  ]

  const neighborhoods = [
    'Centro',
    'Moinhos de Vento',
    'Bom Fim',
    'Petrópolis',
    'Vila Mariana',
    'Higienópolis',
    'Auxiliadora',
    'Santana',
    'Outro'
  ]

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    onFilterChange(newFilters)
  }

  return (
    <div className="filter-section mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Filtros de Busca</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          {isOpen ? 'Recolher' : 'Expandir'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bairro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro
              </label>
              <select
                value={filters.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os bairros</option>
                {neighborhoods.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Imóvel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Imóvel
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os tipos</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Mínimo (R$)
              </label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleInputChange('priceMin', e.target.value)}
                placeholder="Ex: 100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Máximo (R$)
              </label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleInputChange('priceMax', e.target.value)}
                placeholder="Ex: 500000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Data Inicial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.dateStart}
                onChange={(e) => handleInputChange('dateStart', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Data Final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filters.dateEnd}
                onChange={(e) => handleInputChange('dateEnd', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Busca por endereço/bairro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Endereço
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleInputChange('searchTerm', e.target.value)}
              placeholder="Digite o endereço ou bairro..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botão Limpar Filtros */}
          <div className="pt-4">
            <button
              onClick={onClearFilters}
              className="btn-secondary w-full md:w-auto"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
