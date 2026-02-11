# Estoque em Dia – Controle de Validade para Mercados

Aplicativo mobile (Android e iOS) + API em C# para controle de validade de produtos em mercados de bairro, evitando perdas por vencimento.

---

## Estrutura do Projeto

- **MercadoApi** – ASP.NET Core Web API (C#, EF Core, SQLite) – **backend único** para os dois apps
- **MercadoApp** – App .NET MAUI (C#, Android e iOS) – frontend original
- **MercadoAppRN** – App React Native (Expo, JavaScript) – frontend alternativo com a mesma API

---

## Backend (API)

### Requisitos

- .NET 9 SDK

### Executar a API

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

- **SQLite**, arquivo `mercado.db` (criado automaticamente na primeira execução).
- **Onde fica o arquivo:**  
  - Se a API foi iniciada pelo Visual Studio: `MercadoApi\bin\Debug\net9.0\mercado.db`  
  - Se foi com `dotnet run` na pasta MercadoApi: `MercadoApi\mercado.db`
- **Como visualizar:** Use o [DB Browser for SQLite](https://sqlitebrowser.org/) (Arquivo → Abrir banco de dados → escolher `mercado.db`). A tabela de produtos é **Produtos**.

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

- **nivelAlerta**: 0 = verde (>30 dias), 1 = laranja (15–30 dias), 2 = vermelho (≤14 dias ou vencido).

---

## App Mobile (Estoque em Dia)

### Requisitos

- .NET 9 SDK
- Workload MAUI: `dotnet workload install maui`
- Para Android: Android SDK
- Para iOS: Xcode (macOS)

### Configurar URL da API

No app, a URL base da API está em `MercadoApp/MauiProgram.cs`:

- **Android (emulador)**: `http://10.0.2.2:5000`
- **iOS/outros**: `http://localhost:5000`

Para dispositivo físico, use o IP da máquina onde a API está rodando (ex.: `http://192.168.1.10:5000`).

### Executar o app

**Sempre execute o restore na raiz** (onde está o `nuget.config`):

```powershell
# Na raiz do projeto (ProjetoMercado)
dotnet restore
cd MercadoApp

# Windows (recomendado pelo terminal – dotnet run funciona)
dotnet build -f net9.0-windows10.0.19041.0
dotnet run -f net9.0-windows10.0.19041.0

# Android: build pelo terminal; para rodar no emulador use o Visual Studio (F5)
dotnet build -f net9.0-android
# O "dotnet run" para Android não funciona bem no terminal. Abra a solution no Visual Studio 2022, selecione MercadoApp, escolha o emulador Android e pressione F5.

# iOS (apenas em macOS)
dotnet build -f net9.0-ios
dotnet run -f net9.0-ios
```

**Dica:** Se o build Android falhar com "Permission denied" em pastas do OneDrive, tente compilar pelo **Visual Studio 2022** (abra a solution e execute o MercadoApp) ou mova o projeto para uma pasta fora do OneDrive.

### Funcionalidades

1. **Lista** – Produtos ordenados por validade; busca por nome; puxar para atualizar.
2. **Cores por validade** – Verde (longe), laranja (15–30 dias), vermelho (≤14 dias ou vencido).
3. **Adicionar** – Nome, foto (câmera/galeria), data entrada, data validade, quantidade.
4. **Editar** – Alterar nome, foto e datas.
5. **Conferir (OK)** – Produto saiu do estoque; opção de informar nova data de validade (novo lote).
6. **Excluir** – Exclusão lógica (produto desativado).

---

## App React Native (Expo) – MercadoAppRN

Frontend alternativo em **React Native (Expo)** usando a **mesma API** (MercadoApi). Útil para quem prefere JavaScript/React e um front mais customizável.

### Requisitos

- Node.js 18+
- npm ou yarn
- App **Expo Go** no celular (para testar) ou emulador Android

### Configurar URL da API

Edite **MercadoAppRN/api/config.js**:

- Emulador Android: `http://10.0.2.2:5000`
- Dispositivo físico: `http://SEU_IP:5000` (ex.: `http://192.168.1.10:5000`)

### Executar

1. Suba a API: `cd MercadoApi` e `dotnet run`.
2. No front React Native:

```bash
cd MercadoAppRN
npm install
npx expo start
```

3. Escaneie o QR code com o Expo Go ou pressione `a` para abrir no emulador Android.

Detalhes em **MercadoAppRN/README.md**.

---

## Fluxo resumido

1. Subir a API (`dotnet run` em `MercadoApi`).
2. Abrir o app (Android ou iOS), lista carrega da API.
3. Adicionar produto → preencher dados → salvar.
4. Na lista, usar **OK** (conferir), **Editar** ou **Excluir** conforme o dia a dia no mercado.

---

## Nome do app

**Estoque em Dia** – foco em controle de validade e estoque em dia.

Cores: verde (principal), branco (fundo), vermelho/laranja para alertas de vencimento.
