import express from 'express'
import { getDatabase } from '../database.js'

const router = express.Router()

// Get all transactions with optional filters
router.get('/', async (req, res) => {
  try {
    const db = getDatabase()
    const {
      neighborhood,
      propertyType,
      priceMin,
      priceMax,
      dateStart,
      dateEnd,
      limit = 1000,
      offset = 0
    } = req.query

    let query = 'SELECT * FROM transactions WHERE 1=1'
    const params = []

    if (neighborhood) {
      query += ' AND neighborhood = ?'
      params.push(neighborhood)
    }

    if (propertyType) {
      query += ' AND propertyType = ?'
      params.push(propertyType)
    }

    if (priceMin) {
      query += ' AND price >= ?'
      params.push(parseFloat(priceMin))
    }

    if (priceMax) {
      query += ' AND price <= ?'
      params.push(parseFloat(priceMax))
    }

    if (dateStart) {
      query += ' AND transactionDate >= ?'
      params.push(dateStart)
    }

    if (dateEnd) {
      query += ' AND transactionDate <= ?'
      params.push(dateEnd)
    }

    query += ' ORDER BY transactionDate DESC'
    query += ` LIMIT ? OFFSET ?`
    params.push(parseInt(limit), parseInt(offset))

    const transactions = await db.all(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE 1=1'
    const countParams = []

    if (neighborhood) {
      countQuery += ' AND neighborhood = ?'
      countParams.push(neighborhood)
    }

    if (propertyType) {
      countQuery += ' AND propertyType = ?'
      countParams.push(propertyType)
    }

    if (priceMin) {
      countQuery += ' AND price >= ?'
      countParams.push(parseFloat(priceMin))
    }

    if (priceMax) {
      countQuery += ' AND price <= ?'
      countParams.push(parseFloat(priceMax))
    }

    if (dateStart) {
      countQuery += ' AND transactionDate >= ?'
      countParams.push(dateStart)
    }

    if (dateEnd) {
      countQuery += ' AND transactionDate <= ?'
      countParams.push(dateEnd)
    }

    const countResult = await db.get(countQuery, countParams)

    res.json({
      data: transactions,
      total: countResult.total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    res.status(500).json({ error: 'Erro ao buscar transações' })
  }
})

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase()
    const transaction = await db.get('SELECT * FROM transactions WHERE id = ?', [req.params.id])

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' })
    }

    res.json(transaction)
  } catch (error) {
    console.error('Erro ao buscar transação:', error)
    res.status(500).json({ error: 'Erro ao buscar transação' })
  }
})

// Create transaction
router.post('/', async (req, res) => {
  try {
    const db = getDatabase()
    const {
      address,
      neighborhood,
      propertyType,
      price,
      area,
      bedrooms,
      bathrooms,
      transactionDate,
      seller,
      buyer,
      registrationNumber
    } = req.body

    if (!address || !neighborhood || !propertyType || !price || !transactionDate) {
      return res.status(400).json({
        error: 'Campos obrigatórios: address, neighborhood, propertyType, price, transactionDate'
      })
    }

    const result = await db.run(
      `INSERT INTO transactions (
        address, neighborhood, propertyType, price, area,
        bedrooms, bathrooms, transactionDate, seller, buyer, registrationNumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [address, neighborhood, propertyType, price, area, bedrooms, bathrooms, transactionDate, seller, buyer, registrationNumber]
    )

    res.status(201).json({
      id: result.lastID,
      message: 'Transação criada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao criar transação:', error)
    res.status(500).json({ error: 'Erro ao criar transação' })
  }
})

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const db = getDatabase()

    const stats = await db.get(`
      SELECT
        COUNT(*) as totalTransactions,
        AVG(price) as avgPrice,
        MIN(price) as minPrice,
        MAX(price) as maxPrice,
        SUM(price) as totalVolume
      FROM transactions
    `)

    res.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro ao buscar estatísticas' })
  }
})

export default router
