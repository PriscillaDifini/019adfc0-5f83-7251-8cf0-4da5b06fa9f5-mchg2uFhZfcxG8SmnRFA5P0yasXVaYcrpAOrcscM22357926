import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import { parse } from 'csv-parse/sync'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../data/portoradar.db')

async function importTransactions(filePath) {
  let db = null
  let importedCount = 0
  let errorCount = 0
  const errors = []

  try {
    // Validar arquivo
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Arquivo não encontrado: ${filePath}`)
      process.exit(1)
    }

    const ext = path.extname(filePath).toLowerCase()
    if (ext !== '.csv') {
      console.error('❌ Por favor, use um arquivo CSV')
      process.exit(1)
    }

    // Conectar ao banco
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    await db.exec('PRAGMA foreign_keys = ON')

    console.log('📂 Lendo arquivo CSV...')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    console.log(`📊 Total de registros encontrados: ${records.length}\n`)

    if (records.length === 0) {
      console.error('❌ Nenhum registro encontrado no arquivo')
      process.exit(1)
    }

    // Iniciar transação
    await db.exec('BEGIN TRANSACTION')

    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const lineNumber = i + 2 // +2 porque começa em 1 e tem cabeçalho

      try {
        // Validar campos obrigatórios
        if (!record.address || !record.neighborhood || !record.propertyType || !record.price || !record.transactionDate) {
          throw new Error(
            `Campos obrigatórios faltando. Requeridos: address, neighborhood, propertyType, price, transactionDate`
          )
        }

        // Validar e converter preço
        const price = parseFloat(record.price)
        if (isNaN(price) || price <= 0) {
          throw new Error(`Preço inválido: "${record.price}"`)
        }

        // Validar data
        const transactionDate = record.transactionDate
        if (!isValidDate(transactionDate)) {
          throw new Error(`Data inválida: "${transactionDate}" (use YYYY-MM-DD)`)
        }

        // Validar área (opcional)
        let area = null
        if (record.area) {
          area = parseFloat(record.area)
          if (isNaN(area) || area <= 0) {
            throw new Error(`Área inválida: "${record.area}"`)
          }
        }

        // Validar quartos e banheiros (opcional)
        let bedrooms = null
        let bathrooms = null
        if (record.bedrooms) {
          bedrooms = parseInt(record.bedrooms)
          if (isNaN(bedrooms) || bedrooms < 0) {
            throw new Error(`Quartos inválido: "${record.bedrooms}"`)
          }
        }
        if (record.bathrooms) {
          bathrooms = parseInt(record.bathrooms)
          if (isNaN(bathrooms) || bathrooms < 0) {
            throw new Error(`Banheiros inválido: "${record.bathrooms}"`)
          }
        }

        // Inserir transação
        await db.run(
          `INSERT INTO transactions (
            address, neighborhood, propertyType, price, area,
            bedrooms, bathrooms, transactionDate, seller, buyer, registrationNumber
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            record.address,
            record.neighborhood,
            record.propertyType,
            price,
            area,
            bedrooms,
            bathrooms,
            transactionDate,
            record.seller || null,
            record.buyer || null,
            record.registrationNumber || null
          ]
        )

        importedCount++

        // Mostrar progresso
        if ((i + 1) % 10 === 0) {
          process.stdout.write(`✅ Processados: ${i + 1}/${records.length}\r`)
        }
      } catch (error) {
        errorCount++
        errors.push({
          line: lineNumber,
          data: record,
          error: error.message
        })
      }
    }

    // Confirmar transação
    await db.exec('COMMIT')

    console.log('\n')
    console.log('═'.repeat(60))
    console.log('📊 RESULTADO DA IMPORTAÇÃO')
    console.log('═'.repeat(60))
    console.log(`✅ Registros importados com sucesso: ${importedCount}`)
    console.log(`❌ Registros com erro: ${errorCount}`)
    console.log(`📈 Total processado: ${records.length}`)
    console.log('═'.repeat(60))

    if (errors.length > 0 && errors.length <= 20) {
      console.log('\n⚠️  ERROS ENCONTRADOS:\n')
      errors.forEach(err => {
        console.log(`Linha ${err.line}:`)
        console.log(`  Dados: ${JSON.stringify(err.data)}`)
        console.log(`  Erro: ${err.error}\n`)
      })
    } else if (errors.length > 20) {
      console.log(`\n⚠️  Primeiros 20 erros de ${errors.length}:\n`)
      errors.slice(0, 20).forEach(err => {
        console.log(`Linha ${err.line}: ${err.error}`)
      })
      console.log(`\n... e mais ${errors.length - 20} erros`)
    }

    console.log('\n✨ Importação concluída!')

    if (importedCount > 0) {
      console.log(`\n💾 ${importedCount} transações foram adicionadas ao banco de dados`)
    }

    process.exit(importedCount > 0 ? 0 : 1)
  } catch (error) {
    console.error('❌ Erro durante importação:', error.message)
    if (db) {
      try {
        await db.exec('ROLLBACK')
      } catch (e) {
        // Ignore rollback errors
      }
    }
    process.exit(1)
  } finally {
    if (db) {
      await db.close()
    }
  }
}

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) return false
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

// Executar script
const filePath = process.argv[2]

if (!filePath) {
  console.log('Uso: node import-transactions.js <arquivo.csv>\n')
  console.log('Formato esperado do CSV:')
  console.log('  address,neighborhood,propertyType,price,transactionDate[,area,bedrooms,bathrooms,seller,buyer,registrationNumber]\n')
  console.log('Exemplo:')
  console.log('  Rua A 123,Centro,Apartamento,500000,2024-03-15,100,2,2,João Silva,Maria Santos')
  process.exit(1)
}

importTransactions(filePath)
