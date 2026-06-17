# Firebase / Firestore

O projeto agora esta preparado para usar Firebase Firestore como banco de dados.

## Configuracao rapida

1. Crie um projeto no Firebase.
2. Ative o Firestore Database.
3. Cadastre um app Web no Firebase.
4. Crie um arquivo `.env` na raiz do projeto copiando o conteudo de `.env.example`.
5. Cole as credenciais do Firebase no `.env`.
6. Reinicie o projeto com `npm run dev`.

## Colecoes usadas

- `categories`
- `products`
- `clients`
- `coupons`
- `orders`
- `payments`

Na primeira execucao com Firebase configurado, os dados iniciais sao enviados automaticamente para essas colecoes.

## Fala curta para apresentar

> A camada de persistencia foi migrada para Firebase Firestore. O React usa um hook reutilizavel chamado `useFirestoreCollection`, que escuta as colecoes em tempo real com `onSnapshot` e grava alteracoes de CRUD com batch. As entidades continuam relacionadas por IDs, e o relatorio JOIN continua buscando cliente, produto, categoria, cupom e pagamento a partir dos documentos do Firestore.

Sem as credenciais no `.env`, o app abre em modo demo local para nao travar a apresentacao.
