# Estoque em Dia – Controle de Validade para Mercados

Aplicativo mobile (Android) + API em C# para controle de validade de produtos em mercados de bairro, evitando perdas por vencimento.

---

## Estrutura do Projeto

- **MercadoApi** – ASP.NET Core Web API (C#, EF Core, SQL Server) – backend
- **MercadoAppRN** – App React Native (Expo, JavaScript) – frontend principal

---

## Backend (API)

### Requisitos

- .NET 9 SDK

### Executar a API (local)

**Importante:** Execute sempre a partir da **raiz do projeto** (onde está o `nuget.config`), pois ele contém a configuração para o NuGet funcionar corretamente.

```powershell
# Na raiz do projeto (ProjetoMercado)
dotnet restore
cd MercadoApi
dotnet run
```

A API sobe em **http://localhost:5000**.  
Documentação Swagger: **http://localhost:5000/swagger**

### Banco de dados

- **SQL Server (Azure SQL)** em producao.
- Em desenvolvimento local, configure uma string de conexao local em `MercadoApi/appsettings.json`.

### Endpoints (REST)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Lista produtos ativos ordenados por data de validade (mais próximo primeiro). Query: `?busca=nome` |
| GET | `/api/produtos/{id}` | Obtém um produto por ID |
| POST | `/api/produtos` | Cria novo produto |
| PUT | `/api/produtos/{id}` | Atualiza produto (editar) |
| PATCH | `/api/produtos/{id}/conferir` | Marca como conferido; opcional: nova data de validade (novo lote) |
| DELETE | `/api/produtos/{id}` | Exclui (desativa) produto |

### Exemplo de payload (criar/editar)

**POST /api/produtos**

```json
{
  "nomeProduto": "Leite integral 1L",
  "fotoProduto": "",
  "dataEntrada": "2025-02-04",
  "dataValidade": "2025-02-18",
  "quantidade": 1
}
```

**Resposta (produto com dados de validade calculados):**

```json
{
  "id": 1,
  "nomeProduto": "Leite integral 1L",
  "fotoProduto": "",
  "dataEntrada": "2025-02-04T00:00:00",
  "dataValidade": "2025-02-18T00:00:00",
  "quantidade": 1,
  "ativo": true,
  "criadoEm": "2025-02-04T12:00:00",
  "diasRestantes": 14,
  "textoValidade": "Vence em 14 dias",
  "nivelAlerta": 2
}
```

- **nivelAlerta**: 0 = verde (>30 dias), 1 = laranja (15–30 dias), 2 = vermelho (<=14 dias ou vencido).

---

## App React Native (Expo) – MercadoAppRN

Frontend alternativo em **React Native (Expo)** usando a **mesma API** (MercadoApi). Útil para quem prefere JavaScript/React e um front mais customizável.

### Requisitos

- Node.js 18+
- npm ou yarn
- Android (Expo Go para testes ou APK)

### Configurar URL da API

Edite **MercadoAppRN/api/config.js**:

- Emulador Android: `http://10.0.2.2:5000`
- Dispositivo físico: `http://SEU_IP:5000` (ex.: `http://192.168.1.10:5000`)
- Producao (Azure): `https://mercado-api-breno-hqgtbtabdmg4cfem.brazilsouth-01.azurewebsites.net`

### Executar

1. Suba a API: `cd MercadoApi` e `dotnet run`.
2. No front React Native:

```bash
cd MercadoAppRN
npm install
npx expo start
```

3. Escaneie o QR code com o Expo Go ou pressione `a` para abrir no emulador Android.

### Gerar APK (sem Expo Go)

```bash
cd MercadoAppRN
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Detalhes em **MercadoAppRN/README.md**.

---

## Fluxo resumido

1. Subir a API (`dotnet run` em `MercadoApi`) ou usar a URL do Azure.
2. Abrir o app (Android), lista carrega da API.
3. Adicionar produto → preencher dados → salvar.
4. Na lista, usar **OK** (conferir), **Editar** ou **Excluir** conforme o dia a dia no mercado.

---

## Nome do app

**Estoque em Dia** – foco em controle de validade e estoque em dia.

Cores: verde (principal), branco (fundo), vermelho/laranja para alertas de vencimento.
