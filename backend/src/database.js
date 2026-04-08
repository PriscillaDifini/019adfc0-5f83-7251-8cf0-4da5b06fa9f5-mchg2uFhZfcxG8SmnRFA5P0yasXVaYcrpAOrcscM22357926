import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../data/portoradar.db')

let db = null

export async function initializeDatabase() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    await db.exec('PRAGMA foreign_keys = ON')

    // Create transactions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL,
        neighborhood TEXT NOT NULL,
        propertyType TEXT NOT NULL,
        price REAL NOT NULL,
        area REAL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        transactionDate TEXT NOT NULL,
        seller TEXT,
        buyer TEXT,
        registrationNumber TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create index for better query performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_neighborhood ON transactions(neighborhood);
      CREATE INDEX IF NOT EXISTS idx_propertyType ON transactions(propertyType);
      CREATE INDEX IF NOT EXISTS idx_price ON transactions(price);
      CREATE INDEX IF NOT EXISTS idx_transactionDate ON transactions(transactionDate);
    `)

    console.log('✅ Banco de dados inicializado com sucesso')
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error)
    throw error
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Banco de dados não foi inicializado')
  }
  return db
}
