# Documentação da API – Estoque em Dia

## Base URL

- Desenvolvimento: `http://localhost:5000`
- Android emulador: `http://10.0.2.2:5000`

## Autenticação

Nenhuma (API local/simples).

## Endpoints

### 1. Listar produtos

**GET** `/api/produtos`

Ordenação: por data de validade (mais próximo primeiro).  
Retorna apenas produtos ativos.

**Query:**

| Parâmetro | Tipo   | Descrição        |
|-----------|--------|------------------|
| busca     | string | Filtro por nome  |

**Resposta:** `200 OK` – array de `ProdutoDto`.

---

### 2. Obter produto por ID

**GET** `/api/produtos/{id}`

**Resposta:** `200 OK` – `ProdutoDto` ou `404 Not Found`.

---

### 3. Criar produto

**POST** `/api/produtos`

**Body (JSON):**

```json
{
  "nomeProduto": "string",
  "fotoProduto": "string (URL ou Base64)",
  "dataEntrada": "datetime",
  "dataValidade": "datetime",
  "quantidade": 1
}
```

**Resposta:** `201 Created` – `ProdutoDto` (com `diasRestantes`, `textoValidade`, `nivelAlerta`).

---

### 4. Atualizar produto

**PUT** `/api/produtos/{id}`

**Body (JSON):** todos os campos opcionais.

```json
{
  "nomeProduto": "string",
  "fotoProduto": "string",
  "dataEntrada": "datetime",
  "dataValidade": "datetime",
  "quantidade": 1,
  "ativo": true
}
```

**Resposta:** `200 OK` – `ProdutoDto`.

---

### 5. Conferir produto

**PATCH** `/api/produtos/{id}/conferir`

Usado quando o produto já saiu do estoque. Pode enviar nova data de validade (novo lote).

**Body (JSON):** opcional

```json
{
  "novaDataValidade": "datetime"
}
```

**Resposta:** `200 OK` – `ProdutoDto`.

---

### 6. Excluir produto

**DELETE** `/api/produtos/{id}`

Exclusão lógica: define `ativo = false`.

**Resposta:** `204 No Content`.

---

## Modelo de resposta (ProdutoDto)

| Campo         | Tipo     | Descrição |
|---------------|----------|-----------|
| id            | int      | ID do produto |
| nomeProduto   | string   | Nome |
| fotoProduto   | string   | URL ou Base64 da foto |
| dataEntrada   | datetime | Data de entrada |
| dataValidade  | datetime | Data de validade |
| quantidade    | int      | Quantidade |
| ativo         | bool     | Se está ativo |
| criadoEm      | datetime | Data de criação |
| diasRestantes | int      | Dias até vencer (negativo = vencido) |
| textoValidade | string   | Ex.: "Vence em 5 dias", "Vence amanhã", "Vencido há 2 dias" |
| nivelAlerta   | int      | 0 = verde, 1 = laranja, 2 = vermelho |

### Regras de alerta

- **Vermelho (2):** `diasRestantes <= 14`
- **Laranja (1):** `15 <= diasRestantes <= 30`
- **Verde (0):** `diasRestantes > 30`
