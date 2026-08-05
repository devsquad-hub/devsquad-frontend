# Plano: marca, autenticação própria e hierarquia visual do DevSquad

> **Objetivo:** transformar o frontend existente em uma experiência DevSquad mais reconhecível e legível, usando os assets oficiais, removendo componentes visuais prontos do Clerk e adicionando movimento discreto sem sacrificar acessibilidade ou estabilidade.

## Contexto e limites

- O App Router, o `ClerkProvider`, o `clerkMiddleware` e as rotas de backend continuam sendo usados como infraestrutura.
- Nenhum componente de UI do Clerk (`Show`, `SignIn`, `SignUp`, `SignInButton`, `SignUpButton` ou `UserButton`) será renderizado.
- A autenticação visual será composta por componentes próprios, usando somente os hooks headless do Clerk para criar sessão, verificar e-mail e sair.
- O sistema visual continua alinhado ao GitHub/Primer: tipografia do sistema, bordas claras, contraste alto, cor de ação azul/verde e ausência de gradientes decorativos.
- O movimento será feito com CSS e `IntersectionObserver`, somente com `opacity` e `transform`, e será desligado para quem prefere movimento reduzido.

## Tarefas

1. **Identidade e metadados**
   - Copiar o logotipo e o favicon fornecidos para os assets públicos do frontend.
   - Substituir o marcador `</>` do cabeçalho pela logo oficial, com `alt`, dimensões explícitas e versão responsiva.
   - Declarar os ícones da aplicação na metadata do App Router e manter o idioma `pt-BR`.

2. **Autenticação headless e controles próprios**
   - Criar um componente de autenticação reutilizável para botões de entrar/cadastrar, menu de conta, avatar/initials e logout.
   - Substituir os componentes visuais do Clerk no cabeçalho e na candidatura por esse componente.
   - Criar formulário próprio de login com e-mail/senha, estado de carregamento, erros legíveis e redirecionamento para `/app`.
   - Criar formulário próprio de cadastro com nome, e-mail e senha; quando a instância exigir verificação, continuar o fluxo com código de e-mail e só então ativar a sessão.
   - Garantir que o formulário tenha labels, foco visível, `aria-live` para erros e não dependa de markup interno do Clerk.

3. **Hierarquia e movimento**
   - Adicionar uma primitiva `Reveal` baseada em `IntersectionObserver` para hero, grupos de equipe, posições e painéis do projeto.
   - Criar estados de entrada, hover, foco e abertura de candidatura usando apenas propriedades animáveis e com `prefers-reduced-motion` respeitado.
   - Reforçar a hierarquia visual com superfícies, cabeçalhos de seção, métricas e navegação contextual sem criar cards aninhados desnecessários.
   - Melhorar o cabeçalho e os estados responsivos para que a marca e as ações continuem reconhecíveis em telas estreitas.

4. **Validação**
   - Adicionar testes unitários para funções e estados de autenticação que não dependam da rede.
   - Rodar format check, Vitest, lint, typecheck, build e os testes E2E existentes.
   - Rodar Semgrep no frontend e revisar imports residuais de componentes visuais do Clerk.
   - Sincronizar o checkout de trabalho, fazer commit e enviar a alteração para `devsquad-hub/devsquad-frontend`.

## Critérios de aceite

- O cabeçalho mostra a logo fornecida e o favicon é servido pelo App Router.
- `rg` não encontra `Show`, `SignInButton`, `SignUpButton`, `UserButton`, `<SignIn` ou `<SignUp` em `src`.
- Usuários deslogados conseguem abrir login/cadastro próprios; usuários logados veem perfil próprio e conseguem sair.
- Candidatura mostra o formulário quando há sessão e orienta para login próprio quando não há.
- A hierarquia continua utilizável por teclado, leitor de tela e `prefers-reduced-motion: reduce`.
- Todas as verificações automatizadas passam antes do push.
