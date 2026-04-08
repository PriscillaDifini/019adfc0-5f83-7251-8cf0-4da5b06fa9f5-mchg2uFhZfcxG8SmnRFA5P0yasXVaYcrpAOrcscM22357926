# 📊 Guia de Fontes de Dados Oficiais para Porto Alegre

Instruções detalhadas para obter dados reais de transações imobiliárias de Porto Alegre de fontes oficiais.

## 1️⃣ Base dos Dados (RECOMENDADO)

**Link:** [basedosdados.org/dataset/registro-de-imoveis-do-brasil](https://basedosdados.org/dataset/registro-de-imoveis-do-brasil)

### Características
✅ Dados desde 2012  
✅ Tratados e prontos para análise  
✅ Disponível em SQL, Python, R  
✅ Mantido pela ARISP e ARIRJ + Fipe  
✅ Filtros por UF, Município, Período  

### Como Usar

#### Opção A: Interface Web (Mais Fácil)

1. Acesse: https://basedosdados.org/dataset/registro-de-imoveis-do-brasil
2. Clique em "Explorar Dados"
3. Selecione **Rio Grande do Sul** no filtro de Estado
4. Selecione **Porto Alegre** no filtro de Município
5. Defina o período desejado (ex: últimos 12 meses)
6. Clique em "Baixar como CSV"

#### Opção B: API Python (Para Automatizar)

```python
import basedosdados as bd

# Conectar à Base dos Dados
tabela = bd.read(
    dataset_id="registrodeimoveis_br",
    table_id="transferencias_imoveis_pessoas_fisicas",
    filters=[
        {"column": "uf", "operator": "=", "value": "RS"},
        {"column": "municipio", "operator": "=", "value": "Porto Alegre"},
    ],
    limit=10000
)

# Salvar como CSV
tabela.to_csv('porto_alegre_imoveis.csv', index=False)
print(f"✅ {len(tabela)} transações baixadas!")
```

#### Opção C: BigQuery SQL

```sql
SELECT
  *
FROM
  `basedosdados.registrodeimoveis_br.transferencias_imoveis_pessoas_fisicas`
WHERE
  uf = 'RS'
  AND municipio = 'Porto Alegre'
  AND ano >= 2023
LIMIT 10000
```

### Estrutura dos Dados

| Campo | Descrição |
|-------|-----------|
| `id_imovel` | ID único do imóvel |
| `endereco` | Endereço completo |
| `bairro` | Bairro/Zona |
| `municipio` | Município |
| `uf` | Unidade Federativa |
| `tipo_imovel` | Tipo (Apartamento, Casa, etc) |
| `valor_transacao` | Valor em R$ |
| `data_transacao` | Data (YYYY-MM-DD) |
| `ano` | Ano da transação |
| `mes` | Mês da transação |
| `vendedor` | Nome do vendedor |
| `comprador` | Nome do comprador |

---

## 2️⃣ Portal Estatístico Registral (ONR)

**Link:** [registrodeimoveis.org.br/portal-estatistico-registral](https://www.registrodeimoveis.org.br/portal-estatistico-registral)

### Características
✅ Dados Oficiais do ONR  
✅ Atualizado Diariamente  
✅ Filtros por UF, Comarca, Serventia  
✅ Informações desde 2008  

### Como Usar

1. Acesse o portal
2. Selecione filtros:
   - **UF:** Rio Grande do Sul
   - **Comarca:** Porto Alegre
   - **Período:** Data desejada
3. Clique em "Consultar"
4. Exporte os dados (geralmente em Excel/CSV)

---

## 3️⃣ Lei da Transparência Imobiliária - Prefeitura POA

**Link:** [prefeitura.poa.br/certidao_imobiliario](https://prefeitura.poa.br/certidao_imobiliario)

### Características
✅ Dados ITBI (Imposto sobre Transmissão)  
✅ Dados Oficiais da Prefeitura  
✅ Primeira lei do Brasil (2023)  
✅ Atualizações frequentes  

### Como Usar

1. Acesse o portal da Prefeitura
2. Busque por "Transparência Imobiliária" ou "ITBI"
3. Selecione período desejado
4. Download dos dados em Excel/CSV
5. Processe conforme necessário

---

## 4️⃣ Cartórios de Registro - Porto Alegre

### 6ª Zona (Centro)
- **Link:** [sistemafederal.com.br](https://sistemafederal.com.br/cartorios/rs/porto-alegre/cartorio-de-registro-de-imoveis-6-zona)
- **Contato:** Para acesso a dados históricos e certidões

### 2ª Zona
- **Link:** [risegundazonapoa.com](https://www.risegundazonapoa.com/)
- **Contato:** Para registros específicos da região

---

## 🔄 Fluxo de Importação Completo

```
1. Baixar Dados
   ↓
2. Formatar para CSV padrão
   ↓
3. Executar script de importação
   ↓
4. Visualizar no Dashboard
```

### Exemplo Prático

#### Passo 1: Baixar da Base dos Dados

```bash
# Salvar como: porto_alegre_2024.csv
# Colunas principais: endereco, bairro, tipo_imovel, valor_transacao, data_transacao
```

#### Passo 2: Converter formato (se necessário)

Se precisar mapear campos:

```python
import pandas as pd

# Ler dados originais
df = pd.read_csv('porto_alegre_2024.csv')

# Renomear colunas conforme esperado pelo PortoRadar
df = df.rename(columns={
    'endereco': 'address',
    'bairro': 'neighborhood',
    'tipo_imovel': 'propertyType',
    'valor_transacao': 'price',
    'data_transacao': 'transactionDate',
    'vendedor': 'seller',
    'comprador': 'buyer'
})

# Salvar formatado
df.to_csv('porto_alegre_formatado.csv', index=False)
```

#### Passo 3: Importar para o PortoRadar

```bash
node backend/src/scripts/import-transactions.js porto_alegre_formatado.csv
```

#### Passo 4: Acessar Dashboard

```bash
npm run dev
# Abrir http://localhost:5173
```

---

## 📋 Mapeamento de Campos

### Base dos Dados → PortoRadar Pro

```
Base dos Dados               PortoRadar Pro
─────────────────────────────────────────
endereco          →  address
bairro            →  neighborhood
tipo_imovel       →  propertyType
valor_transacao   →  price
data_transacao    →  transactionDate
vendedor          →  seller
comprador         →  buyer
matricula         →  registrationNumber
area_imovel       →  area
```

---

## 🛠️ Scripts Helper

### Script Python para Baixar e Converter

```python
# salvar como: download_dados.py

import basedosdados as bd
import pandas as pd

print("📥 Baixando dados de Porto Alegre...")

# Baixar dados
df = bd.read(
    dataset_id="registrodeimoveis_br",
    table_id="transferencias_imoveis_pessoas_fisicas",
    filters=[
        {"column": "uf", "operator": "=", "value": "RS"},
        {"column": "municipio", "operator": "=", "value": "Porto Alegre"},
    ]
)

print(f"✅ {len(df)} transações baixadas")

# Mapear colunas
df = df.rename(columns={
    'endereco': 'address',
    'bairro': 'neighborhood',
    'tipo_imovel': 'propertyType',
    'valor_transacao': 'price',
    'data_transacao': 'transactionDate',
    'vendedor': 'seller',
    'comprador': 'buyer',
    'matricula': 'registrationNumber'
})

# Selecionar colunas necessárias
cols = ['address', 'neighborhood', 'propertyType', 'price', 'transactionDate', 
        'seller', 'buyer', 'registrationNumber']
df = df[[col for col in cols if col in df.columns]]

# Salvar
df.to_csv('porto_alegre_dados.csv', index=False)
print("💾 Dados salvos em: porto_alegre_dados.csv")
```

### Executar

```bash
# Instalar dependência
pip install basedosdados

# Executar script
python download_dados.py

# Importar para o PortoRadar
node backend/src/scripts/import-transactions.js porto_alegre_dados.csv
```

---

## 📊 Dicas Importantes

### Validação de Dados
- Verifique se há valores nulos nas colunas obrigatórias
- Confirme se os tipos de imóvel estão conforme esperado
- Valide o formato das datas

### Performance
- Para grandes volumes (>50.000 registros), considere importar em lotes
- O script de importação processa automaticamente em transação

### Atualizações
- A Base dos Dados é atualizada regularmente
- Reexecute o download periodicamente para manter dados atuais
- O script não cria duplicatas com `registrationNumber`

### Qualidade
- Base dos Dados: **Excelente** (dados tratados)
- Portal Estatístico: **Ótima** (dados oficiais)
- Lei Transparência POA: **Confiável** (dados municipais)

---

## ✅ Checklist

- [ ] Acesso à Base dos Dados (criar conta gratuita)
- [ ] Download dos dados de Porto Alegre
- [ ] Verificação do formato CSV
- [ ] Validação das colunas
- [ ] Execução do script de importação
- [ ] Verificação no dashboard
- [ ] Planejamento de atualizações periódicas

---

## 🎯 Próximos Passos

1. **Criar conta** em Base dos Dados (gratuito)
2. **Baixar dados** de Porto Alegre
3. **Formatar** conforme especificação
4. **Importar** com o script
5. **Analisar** no Dashboard
6. **Atualizar** regularmente (semanal/mensal)

---

**PortoRadar Pro** - Análise com dados oficiais confiáveis 📊

Sources:
- [Base dos Dados - Registro de Imóveis](https://basedosdados.org/dataset/1f81c113-41c2-493c-985a-c0f1502a37cd)
- [Portal Estatístico Registral](https://www.registrodeimoveis.org.br/portal-estatistico-registral)
- [Mapa do Registro de Imóveis](https://www.registrodeimoveis.org.br/servicos/mapa)
- [Prefeitura de Porto Alegre - Transparência](https://prefeitura.poa.br/certidao_imobiliario)
