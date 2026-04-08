import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeDatabase } from './database.js'
import { seedDatabase } from './seeds/sampleData.js'
import transactionsRouter from './routes/transactions.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Database
await initializeDatabase()
await seedDatabase()

// Routes
app.use('/api/transactions', transactionsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
  console.log(`📊 API disponível em http://localhost:${PORT}/api`)
})
