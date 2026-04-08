import { getDatabase } from '../database.js'

const SAMPLE_TRANSACTIONS = [
  {
    address: 'Rua Setembrina, 1245',
    neighborhood: 'Moinhos de Vento',
    propertyType: 'Apartamento',
    price: 850000,
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    transactionDate: '2024-03-15',
    seller: 'João Silva',
    buyer: 'Maria Santos'
  },
  {
    address: 'Av. Farrapos, 2100',
    neighborhood: 'Bom Fim',
    propertyType: 'Casa',
    price: 650000,
    area: 200,
    bedrooms: 4,
    bathrooms: 3,
    transactionDate: '2024-03-10',
    seller: 'Carlos Oliveira',
    buyer: 'Ana Costa'
  },
  {
    address: 'Rua Vinte de Setembro, 500',
    neighborhood: 'Centro',
    propertyType: 'Comercial',
    price: 1200000,
    area: 400,
    bedrooms: 0,
    bathrooms: 2,
    transactionDate: '2024-03-05',
    seller: 'Empresa ABC',
    buyer: 'Empresa XYZ'
  },
  {
    address: 'Av. Petrópolis, 800',
    neighborhood: 'Petrópolis',
    propertyType: 'Apartamento',
    price: 550000,
    area: 90,
    bedrooms: 2,
    bathrooms: 2,
    transactionDate: '2024-02-28',
    seller: 'Fernando Lima',
    buyer: 'Juliana Gomes'
  },
  {
    address: 'Rua Botafogo, 1500',
    neighborhood: 'Vila Mariana',
    propertyType: 'Casa',
    price: 890000,
    area: 250,
    bedrooms: 5,
    bathrooms: 3,
    transactionDate: '2024-02-20',
    seller: 'Patricia Martins',
    buyer: 'Roberto Dias'
  },
  {
    address: 'Rua Higienópolis, 600',
    neighborhood: 'Higienópolis',
    propertyType: 'Lote',
    price: 400000,
    area: 500,
    bedrooms: 0,
    bathrooms: 0,
    transactionDate: '2024-02-15',
    seller: 'Lucas Ferreira',
    buyer: 'Construtora ABC'
  },
  {
    address: 'Av. Osvaldo Aranha, 250',
    neighborhood: 'Auxiliadora',
    propertyType: 'Apartamento',
    price: 720000,
    area: 110,
    bedrooms: 3,
    bathrooms: 2,
    transactionDate: '2024-02-10',
    seller: 'Beatriz Costa',
    buyer: 'Marcelo Santos'
  },
  {
    address: 'Rua Marquês de Pombal, 350',
    neighborhood: 'Centro',
    propertyType: 'Comercial',
    price: 950000,
    area: 300,
    bedrooms: 0,
    bathrooms: 2,
    transactionDate: '2024-02-05',
    seller: 'Loja Premium',
    buyer: 'Grupo Varejo'
  },
  {
    address: 'Rua Santana, 1200',
    neighborhood: 'Santana',
    propertyType: 'Casa',
    price: 520000,
    area: 180,
    bedrooms: 3,
    bathrooms: 2,
    transactionDate: '2024-01-30',
    seller: 'Adriana Silva',
    buyer: 'Thiago Costa'
  },
  {
    address: 'Av. Moinhos de Vento, 1450',
    neighborhood: 'Moinhos de Vento',
    propertyType: 'Apartamento',
    price: 950000,
    area: 140,
    bedrooms: 3,
    bathrooms: 3,
    transactionDate: '2024-01-25',
    seller: 'Gustavo Almeida',
    buyer: 'Fernanda Rocha'
  }
]

export async function seedDatabase() {
  try {
    const db = getDatabase()

    // Check if data already exists
    const count = await db.get('SELECT COUNT(*) as count FROM transactions')
    if (count.count > 0) {
      console.log('Database already has data, skipping seed')
      return
    }

    for (const transaction of SAMPLE_TRANSACTIONS) {
      await db.run(
        `INSERT INTO transactions (
          address, neighborhood, propertyType, price, area,
          bedrooms, bathrooms, transactionDate, seller, buyer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.address,
          transaction.neighborhood,
          transaction.propertyType,
          transaction.price,
          transaction.area,
          transaction.bedrooms,
          transaction.bathrooms,
          transaction.transactionDate,
          transaction.seller,
          transaction.buyer
        ]
      )
    }

    console.log(`✅ ${SAMPLE_TRANSACTIONS.length} transações de exemplo inseridas`)
  } catch (error) {
    console.error('Erro ao fazer seed do banco de dados:', error)
    throw error
  }
}
