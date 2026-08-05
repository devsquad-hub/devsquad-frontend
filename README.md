# DevSquad Web

Frontend Next.js com App Router, Clerk e Primer React. O navegador conversa com o backend autenticado
somente pelo BFF em `/api/backend/v1/**`; Server Components usam `BACKEND_URL` diretamente.

## Desenvolvimento

```bash
cp .env.example .env.local
npm install
npm run dev
```

Preencha as chaves Clerk e confirme que o backend local está disponível em
`http://localhost:8080`. Para habilitar o botão “Continuar com Google”, ative a conexão Google em
Clerk Dashboard → SSO connections e inclua a origem da aplicação na lista de URLs permitidas. O fluxo
usa o callback headless `/sso-callback`; nenhum componente visual do Clerk é renderizado.

Em produção, configure as mesmas variáveis no Coolify. O callback deve estar disponível em
`https://devsquad.guilhermemarschall.com.br/sso-callback`.

## Verificação

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```
