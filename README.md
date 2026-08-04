# DevSquad Web

Frontend Next.js com App Router, Clerk e Primer React. O navegador conversa com o backend autenticado
somente pelo BFF em `/api/backend/v1/**`; Server Components usam `BACKEND_URL` diretamente.

## Desenvolvimento

```bash
cp .env.example .env.local
npm install
npm run dev
```

Preencha as duas chaves Clerk antes de abrir a aplicação. O backend local deve estar disponível em
`http://localhost:8080`.

## Verificação

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```
