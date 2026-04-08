# 📥 Guia de Importação de Transações Imobiliárias

Script completo para importar dados de transações imobiliárias em massa para o PortoRadar Pro.

## 🎯 O que o Script Faz

- ✅ Lê arquivos CSV com transações imobiliárias
- ✅ Valida todos os dados antes de inserir
- ✅ Insere em lote no banco de dados SQLite
- ✅ Relata sucessos e erros detalhados
- ✅ Usa transações para garantir integridade dos dados

## 📋 Formato do CSV

### Campos Obrigatórios
```
address              - Endereço do imóvel (texto)
neighborhood        - Bairro (texto)
propertyType        - Tipo de imóvel (Apartamento, Casa, Comercial, etc)
price               - Valor em R$ (número)
transactionDate     - Data da transação (YYYY-MM-DD)
```

### Campos Opcionais
```
area                - Área em m² (número)
bedrooms            - Quantidade de quartos (número)
bathrooms           - Quantidade de banheiros (número)
seller              - Nome do vendedor (texto)
buyer               - Nome do comprador (texto)
registrationNumber  - Número de registro (texto)
```

## 📄 Exemplo de CSV

```csv
address,neighborhood,propertyType,price,transactionDate,area,bedrooms,bathrooms,seller,buyer,registrationNumber
Rua A 123,Centro,Apartamento,450000,2024-03-20,85,2,1,João Silva,Maria Santos,ABC123
Rua B 456,Moinhos de Vento,Casa,750000,2024-03-19,180,4,3,Carlos Oliveira,Ana Costa,ABC124
```

## 🚀 Como Usar

### 1. Preparar seu CSV

Crie um arquivo `dados.csv` com seus dados no formato especificado acima.

**Dicas:**
- Use separador de vírgula (`,`)
- Primeira linha deve ser o cabeçalho
- Datas no formato `YYYY-MM-DD` (ex: 2024-03-20)
- Valores numéricos sem símbolo de moeda ou pontuação
- Nomes de bairros devem estar corretos

### 2. Instalar Dependência (se necessário)

```bash
npm install csv-parse
```

### 3. Executar o Script

```bash
# Da raiz do projeto
node backend/src/scripts/import-transactions.js dados.csv

# Ou você pode colocar o arquivo dentro de backend/data/
node backend/src/scripts/import-transactions.js backend/data/dados.csv
```

### 4. Verificar Resultado

O script exibe um relatório detalhado:

```
════════════════════════════════════════════════════════
📊 RESULTADO DA IMPORTAÇÃO
════════════════════════════════════════════════════════
✅ Registros importados com sucesso: 150
❌ Registros com erro: 2
📈 Total processado: 152
════════════════════════════════════════════════════════
```

## ⚠️ Validações Aplicadas

O script valida automaticamente:

- **Campos obrigatórios**: address, neighborhood, propertyType, price, transactionDate
- **Preço**: Deve ser um número positivo
- **Data**: Deve estar no formato YYYY-MM-DD
- **Números**: area, bedrooms, bathrooms devem ser números válidos
- **Duplicatas**: registrationNumber não pode estar duplicado

## 🐛 Tratamento de Erros

Se houver erros, o script mostra:
- **Número da linha** do erro
- **Dados** que falharam
- **Motivo** da falha

Exemplo:
```
Linha 5:
  Dados: {"address":"Rua X","neighborhood":"Bairro","propertyType":"Apartamento","price":"valor_inválido"...}
  Erro: Preço inválido: "valor_inválido"
```

## 📊 Exemplo Prático

### Arquivo: `transacoes_marco.csv`

```csv
address,neighborhood,propertyType,price,transactionDate,area,bedrooms,bathrooms,seller,buyer
Rua Setembrina 1245,Moinhos de Vento,Apartamento,850000,2024-03-15,120,3,2,João Silva,Maria Santos
Av. Farrapos 2100,Bom Fim,Casa,650000,2024-03-10,200,4,3,Carlos Oliveira,Ana Costa
Rua Vinte de Setembro 500,Centro,Comercial,1200000,2024-03-05,400,0,2,Empresa ABC,Empresa XYZ
```

### Executar

```bash
node backend/src/scripts/import-transactions.js transacoes_marco.csv
```

### Resultado

```
✅ Processados: 3/3
════════════════════════════════════════════════════════
📊 RESULTADO DA IMPORTAÇÃO
════════════════════════════════════════════════════════
✅ Registros importados com sucesso: 3
❌ Registros com erro: 0
📈 Total processado: 3
════════════════════════════════════════════════════════

💾 3 transações foram adicionadas ao banco de dados
```

## 💡 Dicas

### Para grandes volumes
- Se tiver 10.000+ registros, pode levar alguns segundos
- O script usa transação no BD para garantir integridade
- Se falhar no meio, nenhum registro parcial é inserido

### Dados de exemplo
Usamos o arquivo `backend/data/exemplo_transacoes.csv` para testes:

```bash
node backend/src/scripts/import-transactions.js backend/data/exemplo_transacoes.csv
```

### Integração com Fontes Oficiais
Após obter dados dos órgãos oficiais (Prefeitura, Cartório, etc):

1. **Baixar dados** em formato CSV/Excel
2. **Formatar** para o padrão esperado
3. **Executar script** de importação
4. **Verificar** no dashboard

## 🔄 Atualização de Dados

Para adicionar mais dados posteriormente:

```bash
# Sempre é seguro executar o script novamente
# Não há duplicação - cada transação é única
node backend/src/scripts/import-transactions.js novos_dados.csv
```

## ❌ Troubleshooting

### "Arquivo não encontrado"
```bash
# Certifique-se do caminho
# Use caminho relativo ou absoluto
node backend/src/scripts/import-transactions.js ./dados.csv
```

### "PROPTERTY_TYPE_INVALIDO"
O tipo de imóvel deve estar na lista:
- Apartamento
- Casa
- Lote
- Comercial
- Industrial
- Outro

### "Preço inválido"
Remova símbolos de moeda e pontuação:
- ❌ R$ 500.000,00
- ✅ 500000

### "Data inválida"
Use formato YYYY-MM-DD:
- ❌ 15/03/2024
- ✅ 2024-03-15

## 📞 Precisa de Ajuda?

Para mais informações sobre o PortoRadar Pro, veja o `README.md` principal.

---

**PortoRadar Pro** - Dados imobiliários precisos para Porto Alegre 🏙️
