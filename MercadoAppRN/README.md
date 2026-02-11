# Estoque em Dia – Frontend React Native (Expo)

Este é o **frontend em React Native** do projeto Estoque em Dia. Ele usa a **mesma API** (MercadoApi) do projeto principal.

## Estrutura

- **api/** – Config da URL da API e funções para chamar os endpoints
- **src/screens/** – Telas (Lista, Adicionar, Editar)
- **src/theme.js** – Cores e espaçamentos
- **App.js** – Navegação (Stack)

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- API rodando em `http://localhost:5000` (ou altere `api/config.js`)

## Configurar URL da API

Edite **api/config.js**:

- **Emulador Android:** `http://10.0.2.2:5000`
- **Dispositivo físico:** `http://SEU_IP:5000` (ex.: `http://192.168.1.10:5000`)
- **iOS simulador:** `http://localhost:5000`

## Instalar e rodar

```bash
cd MercadoAppRN
npm install
npx expo start
```

Depois escaneie o QR code com o app **Expo Go** no celular ou pressione `a` para abrir no emulador Android.

## Ícones (opcional)

Se aparecer aviso de ícone faltando, crie a pasta **assets** e adicione:

- `icon.png` (1024x1024)
- `splash-icon.png` (para splash)
- `adaptive-icon.png` (Android)

Ou use o template oficial e copie os arquivos daqui para o novo projeto:

```bash
npx create-expo-app@latest EstoqueEmDia --template blank
# Depois copie api/, src/, App.js e app.json para o novo projeto
```

## Funcionalidades

- Lista de produtos ordenada por validade (cores: verde, laranja, vermelho)
- Busca por nome
- Adicionar produto (nome, foto, datas, quantidade)
- Editar produto
- Conferir (OK) e Excluir
