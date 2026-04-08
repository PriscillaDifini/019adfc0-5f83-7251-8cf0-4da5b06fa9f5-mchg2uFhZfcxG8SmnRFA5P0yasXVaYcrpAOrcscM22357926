# PortoRadar Pro 📊

Dashboard de análise de transações imobiliárias de Porto Alegre. Oferece dados confiáveis, filtros avançados e análises para investidores e profissionais do mercado imobiliário.

## ✨ Funcionalidades

- **Consulta de Transações**: Acesso a todas as transações imobiliárias registradas
- **Filtros Avançados**: Filtrar por bairro, tipo de imóvel, faixa de preço e período
- **Análises Visuais**: Gráficos e estatísticas de preços por tipo e distribuição
- **Indicadores Principais**: Preço médio, mediano, volume total e quantidade de transações
- **Tabela Detalhada**: Visualização completa com possibilidade de ordenação
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

## 🏗️ Arquitetura

```
porto-alegre-dashboard/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços API
│   │   └── index.css      # Estilos Tailwind
│   └── package.json
├── backend/               # Express + SQLite
│   ├── src/
│   │   ├── routes/        # Rotas API
│   │   ├── seeds/         # Dados iniciais
│   │   ├── database.js    # Configuração DB
│   │   └── server.js      # Servidor principal
│   └── package.json
└── package.json           # Root (workspaces)
```

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou pnpm

### Passos

1. **Clonar e entrar no diretório**
```bash
cd porto-alegre-dashboard
```

2. **Instalar dependências**
```bash
npm install
```

3. **Copiar arquivo de ambiente**
```bash
cp .env.example .env
```

4. **Inicie o desenvolvimento**
```bash
npm run dev
```

Isso iniciará:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000/api

## 📝 Estrutura de Dados

### Tabela: `transactions`

```sql
- id (INTEGER, Primary Key)
- address (TEXT) - Endereço do imóvel
- neighborhood (TEXT) - Bairro
- propertyType (TEXT) - Tipo (Apartamento, Casa, Comercial, etc)
- price (REAL) - Valor da transação
- area (REAL) - Área em m²
- bedrooms (INTEGER) - Número de quartos
- bathrooms (INTEGER) - Número de banheiros
- transactionDate (TEXT) - Data da transação
- seller (TEXT) - Vendedor
- buyer (TEXT) - Comprador
- registrationNumber (TEXT) - Número de registro
- created_at (DATETIME) - Data de criação
```

## 🔌 API Endpoints

### Listar Transações
```
GET /api/transactions
```

**Parâmetros de Query:**
- `neighborhood` - Filtrar por bairro
- `propertyType` - Filtrar por tipo de imóvel
- `priceMin` - Preço mínimo
- `priceMax` - Preço máximo
- `dateStart` - Data inicial (YYYY-MM-DD)
- `dateEnd` - Data final (YYYY-MM-DD)
- `limit` - Limite de resultados (padrão: 1000)
- `offset` - Offset para paginação

**Exemplo:**
```bash
GET /api/transactions?neighborhood=Centro&propertyType=Apartamento&priceMin=500000&priceMax=1000000
```

### Obter Transação Específica
```
GET /api/transactions/:id
```

### Criar Nova Transação
```
POST /api/transactions
```

**Body:**
```json
{
  "address": "Rua Exemplo, 123",
  "neighborhood": "Bairro",
  "propertyType": "Apartamento",
  "price": 500000,
  "area": 100,
  "bedrooms": 2,
  "bathrooms": 2,
  "transactionDate": "2024-03-15",
  "seller": "Nome Vendedor",
  "buyer": "Nome Comprador"
}
```

### Obter Estatísticas
```
GET /api/transactions/stats/summary
```

## 🎨 Bairros Disponíveis

- Centro
- Moinhos de Vento
- Bom Fim
- Petrópolis
- Vila Mariana
- Higienópolis
- Auxiliadora
- Santana
- Outro

## 🏠 Tipos de Imóvel

- Apartamento
- Casa
- Lote
- Comercial
- Industrial
- Outro

## 📦 Build para Produção

```bash
npm run build
```

Isso irá:
- Fazer build do frontend (bundle otimizado)
- Preparar o backend

## 🚀 Deploy

Para executar em produção:

```bash
# Backend
cd backend
npm install --production
npm start

# Frontend (em outro terminal)
cd frontend
npm run build
# Servir a pasta 'dist' com um servidor web
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
PORT=3000
VITE_API_URL=http://localhost:3000/api
NODE_ENV=production
```

## 📊 Dados de Amostra

O sistema inclui 10 transações de exemplo para demonstração. Para adicionar mais dados:

1. **Via API:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Rua Exemplo, 123",
    "neighborhood": "Centro",
    "propertyType": "Apartamento",
    "price": 500000,
    "area": 100,
    "bedrooms": 2,
    "bathrooms": 2,
    "transactionDate": "2024-03-15"
  }'
```

2. **Editar arquivo de seeds:**
   Adicionar transações ao arquivo `backend/src/seeds/sampleData.js`

## 🐛 Troubleshooting

**Erro de conexão API**
- Certifique-se de que o backend está rodando na porta 3000
- Verifique a variável `VITE_API_URL` no arquivo `.env`

**Banco de dados não encontrado**
- O banco é criado automaticamente ao iniciar
- Se houver problemas, delete a pasta `backend/data` e reinicie

**Porta já em uso**
- Backend: `PORT=3001 npm run dev:backend`
- Frontend: Alterar porta no `frontend/vite.config.js`

## 📄 Licença

Este projeto é para fins de análise e demonstração.

## 👨‍💻 Desenvolvimento

Para adicionar novos bairros ou tipos de imóvel:

1. Editar `FilterSection.jsx` - Arrays `neighborhoods` e `propertyTypes`
2. Adicionar dados correspondentes ao seed

---

**PortoRadar Pro** - Análise imobiliária inteligente para Porto Alegre 🏙️
