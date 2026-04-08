export default function Header() {
  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container-dashboard">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PortoRadar Pro</h1>
            <p className="text-gray-600 text-sm mt-1">Análise de Transações Imobiliárias de Porto Alegre</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Dados Oficiais e Confiáveis</p>
            <p className="text-blue-600 font-semibold">Porto Alegre, RS</p>
          </div>
        </div>
      </div>
    </header>
  )
}
