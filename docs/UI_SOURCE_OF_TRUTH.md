---
spec_id: github-like-repository-ui
spec_version: 1.0.0
status: normative
language: pt-BR
last_updated: 2026-08-03
reference_implementation: index.html + styles.css + app.js
baseline_desktop: github-ui-primer-preview.png
baseline_mobile: github-ui-primer-mobile-preview.png
baseline_browser: Chromium 144.0.7559.96
baseline_device_scale_factor: 1
---

# UI Source of Truth — página de repositório

## 0. Autoridade deste documento

Este arquivo é a **fonte normativa única** para reproduzir a interface entregue neste projeto. Ele descreve aparência, conteúdo, geometria, estados e comportamento. Um agente não deve completar lacunas “por bom senso”, modernizar componentes, trocar espaçamentos ou adaptar a aparência ao GitHub atual.

Palavras normativas:

- **DEVE**: obrigatório para conformidade visual.
- **NÃO DEVE**: proibido.
- **PODE**: implementação livre desde que o resultado renderizado permaneça idêntico.

Em caso de conflito, aplicar esta ordem:

1. Este arquivo.
2. Imagens de baseline indicadas na seção 2.
3. `styles.css`.
4. `index.html`.
5. `app.js`.

A meta “1:1” significa **igual ao baseline deste projeto**, não igualdade permanente com futuras versões de `github.com`.

---

## 1. Contrato geral

### 1.1 Resultado obrigatório

A implementação DEVE produzir uma página de repositório com:

- cabeçalho global;
- identificação do repositório e ações;
- navegação por abas;
- toolbar de branch;
- lista de arquivos;
- resumo do commit mais recente;
- cartão de README;
- sidebar com About, Releases, Contributors e Languages;
- rodapé;
- tema claro e escuro automático;
- layouts desktop, tablet e mobile definidos neste documento;
- estados interativos de Watch, Star, Code popover, cópia de URL e seleção de abas.

### 1.2 Restrições

A implementação:

- DEVE usar apenas uma página.
- NÃO DEVE adicionar breadcrumbs, banners, tooltips, loaders, skeletons ou modais não especificados.
- NÃO DEVE alterar textos, contagens, ordem de itens ou capitalização.
- NÃO DEVE introduzir animações de movimento, fade ou transições.
- NÃO DEVE usar sombras além daquelas explicitamente descritas.
- NÃO DEVE substituir o layout por uma biblioteca cujo CSS gere diferenças visuais.
- PODE ser implementada em HTML/CSS/JS, React, Vue, Svelte ou outra tecnologia, desde que o DOM renderizado e o resultado visual respeitem esta especificação.

---

## 2. Baselines e ambiente de validação

### 2.1 Capturas canônicas

| Perfil | Arquivo | Viewport CSS | DPR | Tema |
|---|---|---:|---:|---|
| Desktop | `github-ui-primer-preview.png` | `1440 × 1331` | `1` | claro |
| Mobile | `github-ui-primer-mobile-preview.png` | `390 × 2588` | `1` | claro |

### 2.2 Ambiente canônico

- Navegador: Chromium `144.0.7559.96`.
- Device scale factor: `1`.
- Zoom: `100%`.
- Idioma do documento: `pt-BR`.
- Sistema de cores da captura: claro.
- Largura mínima suportada: `320px`.
- Rolagem vertical natural; nenhuma área principal possui rolagem interna vertical.
- A barra de abas pode rolar horizontalmente quando não couber.

### 2.3 Font rendering

Usar exatamente:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
font-synthesis: none;
text-rendering: optimizeLegibility;
```

Não carregar webfont. Em Linux/Chromium, a cadeia deve resolver para a fonte sans-serif disponível pelo sistema. Não compensar diferenças de plataforma alterando tamanhos ou letter-spacing.

### 2.4 Checksums da entrega de referência

Use estes hashes para confirmar que os arquivos-base não foram modificados:

| Arquivo | SHA-256 |
|---|---|
| `index.html` | `14aa6fc8fe396442181ef6ea880e5ee80a5d60cc4effe3512c196faa709cabd9` |
| `styles.css` | `584d8f8479b77aa85313fb34eb68e5886769eeaa17e5457cc1ccbeca03cfcab9` |
| `app.js` | `70f177e6ca9318da9508544f342f96a79c81dbde4e3c83c258da7f990b07cbb3` |
| desktop baseline | `e95dd9081c164169b015d46978d597fe22286a046d7dfe9d6ecc5c0251ea6585` |
| mobile baseline | `eba5bf18cd0601534d341b8f07030c7632d78b21a5cf852be87ffd2d3f7f8647` |

---

## 3. Tokens visuais

### 3.1 Tema claro

```css
--fg-default: #1f2328;
--fg-muted: #656d76;
--fg-accent: #0969da;
--bg-default: #ffffff;
--bg-inset: #f6f8fa;
--bg-muted: #f6f8fa;
--bg-neutral-muted: rgba(175, 184, 193, 0.2);
--bg-accent-muted: #ddf4ff;
--border-default: #d0d7de;
--border-muted: #d8dee4;
--button-default: #f6f8fa;
--button-default-hover: #f3f4f6;
--button-primary: #1f883d;
```

### 3.2 Tema escuro

Ativar somente por `@media (prefers-color-scheme: dark)`.

```css
--fg-default: #f0f6fc;
--fg-muted: #8d96a0;
--fg-accent: #4493f8;
--bg-default: #0d1117;
--bg-inset: #010409;
--bg-muted: #151b23;
--bg-neutral-muted: rgba(110, 118, 129, 0.2);
--bg-accent-muted: rgba(56, 139, 253, 0.15);
--border-default: #3d444d;
--border-muted: #21262d;
--button-default: #212830;
--button-default-hover: #262c36;
--button-primary: #238636;
```

### 3.3 Cores fixas, independentes do tema

| Uso | Valor |
|---|---|
| indicador da aba ativa | `#fd8c73` |
| texto de botão Code | `#ffffff` |
| pasta | `#54aeff` |
| TypeScript | `#3178c6` |
| CSS | `#663399` |
| HTML | `#e34c26` |
| borda do botão Code | `rgba(31,35,40,.15)` |
| sombra leve de botão | `0 1px 0 rgba(31,35,40,.04)` |
| sombra do popover | `0 8px 24px rgba(140,149,159,.2)` |

### 3.4 Raios

| Elemento | Raio |
|---|---:|
| botões, inputs, cards | `6px` |
| popover Code | `8px` |
| badges, tópicos, barra de linguagens | `999px` |
| avatar | `50%` |
| sublinhado de aba | `2px` |

### 3.5 Bordas

- Borda padrão: `1px solid var(--border-default)`.
- Divisor suave: `1px solid var(--border-muted)`.
- Não usar bordas de 2px, exceto o indicador selecionado das tabs internas do popover.

---

## 4. Tipografia

O tamanho raiz permanece no padrão do navegador: `16px`.

| Uso | Tamanho | Peso | Linha/observação |
|---|---:|---:|---|
| contexto do cabeçalho | `16px` | `600` | uma linha com ellipsis |
| nome owner/repo | `20px` | repo `600` | owner regular |
| texto geral | `16px` | `400` | padrão do navegador |
| botões | herdado | `500` | Code usa `600` |
| tabelas e sidebar | `14px` | `400` | links específicos podem usar `600` |
| badges | `12px` | `500` | topics usam `600` |
| avatar | `11px` | `700` | avatar pequeno `9px` |
| README h1 | `32px` (`2em`) | bold do navegador | margem inferior `16px` |
| README h2 | `24px` (`1.5em`) | bold do navegador | margem superior `24px` |
| sidebar h2 | `16px` | bold do navegador | margem inferior `12px` |
| footer | `12px` | `400` | links também `12px` |

Links:

```css
a { color: var(--fg-accent); text-decoration: none; }
a:hover { text-decoration: underline; }
```

Não aplicar letter-spacing customizado.

---

## 5. Ícones

### 5.1 Contrato base

Todos os ícones lineares devem obedecer:

```css
width: 16px;
height: 16px;
fill: none;
stroke: currentColor;
stroke-width: 1.4;
stroke-linecap: round;
stroke-linejoin: round;
flex: none;
```

Variações:

- `.tiny`: `12 × 12px`.
- `.mark-icon`: `32 × 32px`.
- pontos do ícone de reticências usam `fill: currentColor` e `stroke: none`.

### 5.2 Catálogo e semântica

Usar os mesmos desenhos do sprite de `index.html`, com `viewBox` `0 0 16 16`, exceto a marca, que usa `0 0 24 24`.

| ID | Uso |
|---|---|
| `i-menu` | menu global |
| `i-mark` | marca genérica Codebase |
| `i-search` | pesquisa |
| `i-plus`, `i-down` | criar e menus |
| `i-issue`, `i-pr`, `i-comment` | ações globais e abas |
| `i-book` | repositório, README |
| `i-eye`, `i-fork`, `i-star` | métricas e ações |
| `i-code`, `i-play`, `i-project`, `i-shield`, `i-history` | navegação |
| `i-branch`, `i-tag` | toolbar e releases |
| `i-folder`, `i-file` | lista de arquivos |
| `i-copy`, `i-dots`, `i-law` | utilidades |

Não substituir por emojis, ícones preenchidos ou biblioteca com stroke diferente.

---

## 6. Estrutura e ordem do documento

A ordem vertical DEVE ser:

1. `global-header`
2. `repo-header`
   1. `repo-title-row`
   2. `repo-tabs`
3. `page-container`
   1. `content-column`
   2. `sidebar-column`
4. `footer`

O `page-container`, `repo-title-row`, `repo-tabs` e `footer` têm largura máxima `1280px` e são centralizados com `margin-left/right: auto`.

O `<body>` usa:

```css
margin: 0;
min-width: 320px;
background: var(--bg-default);
```

Todos os elementos usam `box-sizing: border-box`.

---

## 7. Cabeçalho global

### 7.1 Geometria desktop

```css
min-height: 64px;
padding: 16px;
display: grid;
grid-template-columns: minmax(260px,1fr) minmax(260px,350px) minmax(260px,1fr);
align-items: center;
gap: 16px;
background: var(--bg-inset);
border-bottom: 1px solid var(--border-default);
```

### 7.2 Coluna esquerda

Ordem:

1. botão menu;
2. marca;
3. texto `acme / codebase`.

- Contêiner: flex, alinhado ao centro, gap `12px`, `min-width: 0`.
- Botão menu: `32px` de altura e no mínimo `32px` de largura.
- Marca: `32 × 32px`.
- Texto: peso `600`, `white-space: nowrap`, overflow hidden, ellipsis.

### 7.3 Pesquisa

- Altura: `32px`.
- Layout: flex, alinhado ao centro, gap `8px`.
- Padding horizontal: `8px`.
- Borda padrão; raio `6px`.
- Fundo: `var(--bg-default)`.
- Placeholder: `Type / to search`.
- Tecla visual: `/`, fonte `12px`, padding horizontal `5px`, borda padrão, raio `4px`.
- Input ocupa toda a largura restante, sem borda, fundo transparente e sem outline customizado.

### 7.4 Ações da direita

Ordem:

1. botão criar com `+` e chevron;
2. separador;
3. Issues;
4. Pull requests;
5. Inbox;
6. avatar `AM`.

- Contêiner: flex, alinhado ao centro, justificado à direita, gap `4px`.
- Separador: `1 × 20px`, margem horizontal `4px`.
- Avatar: `32 × 32px`.
- Gradiente principal: `linear-gradient(135deg,#8250df,#0969da)`.

---

## 8. Cabeçalho do repositório

### 8.1 Contêiner

- Fundo: `var(--bg-inset)`.
- Borda inferior: padrão.

### 8.2 Linha do título

Desktop:

```css
max-width: 1280px;
margin: 0 auto;
padding: 16px 32px 8px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 20px;
```

Identidade, na ordem:

1. ícone de livro;
2. link `acme`;
3. `/`;
4. link `codebase`, peso `600`;
5. badge `Public`.

- Gap da identidade: `6px`.
- Links owner e repo: `20px`.
- Badge Public: borda padrão, raio pill, padding `1px 7px`, fonte `12px`, peso `500`, cor muted, fundo default.

### 8.3 Ações do repositório

Ordem e conteúdo:

1. `Watch` + `24` + chevron;
2. `Fork` + `263`;
3. `Star` + `1.842`.

- Contêiner: flex, gap `8px`.
- Cada botão: altura `32px`, padding horizontal `12px`, gap `6px`, borda padrão, raio `6px`, fundo button-default, peso `500`.
- Hover: `var(--button-default-hover)`.
- Estado ativo de Watch/Star: somente cor do conteúdo `var(--fg-accent)`; não mudar fundo nem borda.
- Badge interno: fundo `var(--bg-default)`.

### 8.4 Abas

Ordem exata:

1. Code
2. Issues `12`
3. Pull requests `3`
4. Actions
5. Projects
6. Security
7. Insights

Contêiner:

```css
max-width: 1280px;
margin: 0 auto;
padding: 0 24px;
display: flex;
overflow-x: auto;
```

Botão de aba:

- altura `48px`;
- padding horizontal `12px`;
- gap `8px`;
- fundo e borda transparentes;
- `white-space: nowrap`;
- hover: fundo neutral-muted e raio `6px`;
- ativa: peso `600`;
- indicador ativo: posição absoluta, `left/right: 8px`, `bottom: -1px`, altura `2px`, cor `#fd8c73`, raio `2px`.

A aba inicial ativa é `Code`.

---

## 9. Área principal

### 9.1 Grid desktop

```css
max-width: 1280px;
margin: 0 auto;
padding: 24px 32px 40px;
display: grid;
grid-template-columns: minmax(0,1fr) 296px;
gap: 24px;
```

- Coluna esquerda: largura fluida e `min-width: 0`.
- Sidebar: largura fixa de `296px` no desktop.

---

## 10. Toolbar

### 10.1 Layout

- Flex centralizado.
- Gap `8px`.
- Margem inferior `16px`.

Ordem:

1. branch button;
2. links de branches/tags;
3. spacer flexível;
4. Go to file;
5. Add file;
6. Code.

### 10.2 Branch

- Botão: altura `32px`, largura mínima `126px`, conteúdo distribuído com `justify-content: space-between`.
- Conteúdo: ícone branch, texto `main`, chevron.

Links:

- margem esquerda `8px`;
- gap entre links `16px`;
- cada link é inline-flex, gap `6px`, fonte `14px`, cor `var(--fg-default)`;
- textos: `4 branches` e `18 tags`.

### 10.3 Botões neutros

- `Go to file`.
- `Add file` + chevron.
- Altura `32px`, padding horizontal `12px`, gap `6px`, borda padrão, raio `6px`, fundo button-default, peso `500`.

### 10.4 Botão Code

- Altura `32px`.
- Padding horizontal `14px`.
- Gap `6px`.
- Fundo `var(--button-primary)`.
- Texto branco, peso `600`.
- Borda `1px solid rgba(31,35,40,.15)`.
- Raio `6px`.
- Conteúdo: ícone code, `Code`, chevron.

---

## 11. Popover Code

### 11.1 Desktop/tablet

```css
position: absolute;
z-index: 10;
right: 0;
top: 38px;
width: 360px;
padding: 16px;
background: var(--bg-default);
border: 1px solid var(--border-default);
border-radius: 8px;
box-shadow: 0 8px 24px rgba(140,149,159,.2);
```

### 11.2 Conteúdo

Ordem:

1. título `Clone`, em `<strong>`;
2. tabs `HTTPS`, `SSH`, `GitHub CLI`;
3. campo com URL e botão copiar;
4. texto auxiliar.

Tabs internas:

- gap `12px`;
- margem `12px 0 8px`;
- divisor inferior muted;
- botão sem fundo/borda, padding vertical `6px`;
- selecionada: peso `600`, borda inferior `2px solid #fd8c73`.

Campo:

- valor exato: `https://example.com/acme/codebase.git`;
- input flexível, padding `8px`, borda padrão, raio esquerdo `6px`;
- botão copiar: largura `36px`, borda padrão sem borda esquerda, raio direito `6px`, fundo button-default.

Texto inicial: `Use Git ou faça download do ZIP.`

Após copiar com sucesso: `Copiado!`

Após falha: `Selecione e copie a URL manualmente.`

Depois de `1600ms`, retornar ao texto inicial.

### 11.3 Abertura e fechamento

- O popover inicia oculto.
- Clique no botão Code alterna aberto/fechado.
- Clique fora fecha.
- Clique dentro não fecha.
- Não adicionar backdrop.

---

## 12. Card de arquivos

### 12.1 Card

- Borda padrão.
- Raio `6px`.
- `overflow: hidden`.

### 12.2 Commit mais recente

Desktop:

```css
min-height: 54px;
padding: 10px 16px;
display: flex;
align-items: center;
gap: 8px;
background: var(--bg-muted);
border-bottom: 1px solid var(--border-default);
font-size: 14px;
```

Ordem e valores:

1. avatar pequeno `AM`;
2. autor `ana-martins`;
3. mensagem `Refatora página do repositório e melhora responsividade`;
4. hash `7a43dc1`;
5. idade `há 2 horas`;
6. link `146 commits`.

Regras:

- avatar pequeno: `24 × 24px`, fonte `9px`;
- autor: cor default, peso `600`;
- mensagem: cor default, uma linha, ellipsis;
- hash e idade: cor muted, sem quebra;
- commits: `margin-left: auto`, inline-flex, gap `6px`, sem quebra.

### 12.3 Linhas de arquivos

Cada linha desktop:

```css
min-height: 41px;
padding: 8px 16px;
display: grid;
grid-template-columns: minmax(180px,1.1fr) minmax(180px,1.4fr) 110px;
align-items: center;
gap: 16px;
border-top: 1px solid var(--border-muted);
font-size: 14px;
```

- Primeira linha não tem borda superior.
- Hover: fundo `var(--bg-muted)`.
- Nome: flex, gap `12px`, `min-width: 0`.
- Nome e mensagem: uma linha com ellipsis.
- Idade: muted, alinhada à direita, sem quebra.

Conteúdo exato, nesta ordem:

| Tipo | Nome | Mensagem | Idade |
|---|---|---|---|
| pasta | `.github` | `Atualiza templates de contribuição` | `há 3 dias` |
| pasta | `public` | `Adiciona assets públicos` | `semana passada` |
| pasta | `src` | `Refatora página do repositório` | `há 2 horas` |
| arquivo | `.gitignore` | `Configuração inicial` | `mês passado` |
| arquivo | `README.md` | `Documenta execução local` | `há 2 horas` |
| arquivo | `package.json` | `Atualiza dependências do projeto` | `ontem` |
| arquivo | `vite.config.ts` | `Configura build do Vite` | `semana passada` |

---

## 13. Card README

### 13.1 Card e cabeçalho

- Margem superior: `16px`.
- Borda e raio iguais ao card de arquivos.
- Cabeçalho: altura mínima `48px`, padding `8px 16px`, flex, alinhamento central, `justify-content: space-between`, divisor inferior padrão.
- Lado esquerdo: ícone de livro + `README.md`, gap `8px`.
- Lado direito: botão de reticências `32px`.

### 13.2 Corpo

Desktop:

```css
padding: 32px;
line-height: 1.5;
```

Conteúdo exato:

```text
Codebase

Starter visual para produtos de desenvolvimento, construído sobre os padrões públicos do Primer. Esta demonstração reproduz densidade, navegação, bordas, tipografia e hierarquia de uma página de repositório.

Executar localmente

npm run dev

Incluído

• Cabeçalho e navegação responsivos
• Lista de arquivos, commit recente e README
• Modo claro e escuro
• Tokens visuais compatíveis com o Primer
```

Regras:

- H1 e H2 têm padding inferior `.3em` e divisor muted.
- H1: margem `0 0 16px`, tamanho `2em`.
- H2: margem superior `24px`, tamanho `1.5em`.
- Bloco de código: padding `16px`, overflow auto, raio `6px`, fundo muted.
- Não renderizar syntax highlighting.

---

## 14. Sidebar

### 14.1 Estrutura geral

Cada seção:

```css
padding: 0 0 20px;
margin-bottom: 20px;
border-bottom: 1px solid var(--border-muted);
```

A última seção não tem borda inferior.

Título de seção:

- `16px`;
- margem `0 0 12px`.

Parágrafos:

- `14px`;
- `line-height: 1.5`.

### 14.2 About

Cabeçalho: `About` à esquerda, botão de reticências à direita.

Texto:

`Interface demonstrativa de um repositório, pronta para receber seus dados e funcionalidades.`

Link:

`example.dev/codebase`

- fonte `14px`;
- peso `600`.

Tópicos, na ordem:

- `react`
- `primer`
- `typescript`
- `vite`

Cada tópico:

- padding `3px 10px`;
- pill;
- fundo accent-muted;
- cor accent;
- fonte `12px`;
- peso `600`.

Estatísticas, na ordem:

1. Readme
2. MIT license
3. **1.842** stars
4. **24** watching
5. **263** forks

- Grid vertical com gap `8px`.
- Links: flex, gap `8px`, fonte `14px`, cor muted.
- Números em `<strong>` usam cor default.

### 14.3 Releases

- Título `Releases` e link `18`.
- Release: `v2.4.0`, ícone de tag, cor default, peso `600`.
- Meta: `Latest · há 4 dias`, fonte `12px`, muted, margem `4px 0 8px`.
- Link: `+ 17 releases`, fonte `12px`.

### 14.4 Contributors

- Título `Contributors` e link `12`.
- Seis avatares, `32 × 32px`, gap `6px`, na ordem:
  - AM: `linear-gradient(135deg,#8250df,#0969da)`
  - LS: `linear-gradient(135deg,#bf8700,#e16f24)`
  - RB: `linear-gradient(135deg,#1a7f37,#0969da)`
  - JC: `linear-gradient(135deg,#cf222e,#8250df)`
  - MV: `linear-gradient(135deg,#0550ae,#0969da)`
  - TK: `linear-gradient(135deg,#9a6700,#1a7f37)`
- Link: `+ 6 contributors`, fonte `12px`.

### 14.5 Languages

Barra:

- altura `8px`;
- pill;
- overflow hidden;
- sem gaps entre segmentos.

Segmentos:

| Linguagem | Largura | Cor |
|---|---:|---|
| TypeScript | `72.4%` | `#3178c6` |
| CSS | `24.1%` | `#663399` |
| HTML | `3.5%` | `#e34c26` |

Legenda:

- margem superior `10px`;
- flex com wrap;
- gap vertical `8px`, horizontal `16px`;
- fonte `12px`;
- dot `8 × 8px`, circular, margem direita `4px`;
- textos: `TypeScript 72.4%`, `CSS 24.1%`, `HTML 3.5%`.

---

## 15. Rodapé

Desktop:

```css
max-width: 1280px;
min-height: 110px;
margin: 0 auto;
padding: 40px 32px;
display: flex;
align-items: center;
justify-content: center;
flex-wrap: wrap;
gap: 16px;
border-top: 1px solid var(--border-muted);
color: var(--fg-muted);
font-size: 12px;
```

Ordem:

1. marca `32 × 32px`;
2. `© 2026 Codebase Demo`;
3. Terms;
4. Privacy;
5. Security;
6. Status;
7. Docs;
8. Contact.

---

## 16. Componentes base

### 16.1 Icon button

```css
min-width: 32px;
height: 32px;
padding: 0 8px;
display: inline-flex;
align-items: center;
justify-content: center;
gap: 5px;
background: transparent;
border: 1px solid transparent;
border-radius: 6px;
cursor: pointer;
```

- Hover: fundo neutral-muted.
- Variante bordered: border-color default.

### 16.2 Botão neutro

```css
height: 32px;
padding: 0 12px;
display: inline-flex;
align-items: center;
gap: 6px;
border: 1px solid var(--border-default);
border-radius: 6px;
background: var(--button-default);
font-weight: 500;
box-shadow: 0 1px 0 rgba(31,35,40,.04);
```

### 16.3 Avatar

```css
width: 32px;
height: 32px;
border-radius: 50%;
display: inline-flex;
align-items: center;
justify-content: center;
font-size: 11px;
font-weight: 700;
color: #fff;
border: 1px solid var(--border-default);
```

---

## 17. Responsividade

Os breakpoints são inclusivos na condição CSS `max-width` e devem ser aplicados exatamente nesta ordem.

### 17.1 Até `1000px`

```css
.global-header { grid-template-columns: 1fr auto; }
.header-search { grid-column: 1/-1; grid-row: 2; }
.repo-title-row { align-items: flex-start; }
.repo-actions { flex-wrap: wrap; justify-content: flex-end; }
.page-container { grid-template-columns: 1fr; }
.sidebar-column {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 24px;
}
```

Resultado:

- busca passa para a segunda linha;
- main se torna uma coluna;
- sidebar vira grade de duas colunas.

### 17.2 Até `760px`

Cabeçalho:

```css
.global-header {
  min-height: auto;
  padding: 12px;
  grid-template-columns: 1fr auto;
}
.context-title,
.header-separator,
.hide-small { display: none; }
```

Repo:

```css
.repo-title-row { padding: 16px; flex-direction: column; }
.repo-actions {
  width: 100%;
  justify-content: stretch;
  display: grid;
  grid-template-columns: repeat(3,1fr);
}
.segmented-button { justify-content: center; min-width: 0; padding: 0 8px; }
.repo-tabs { padding: 0 8px; }
```

Main e toolbar:

```css
.page-container { padding: 16px; }
.toolbar-row { flex-wrap: wrap; }
.branch-links { order: 3; width: 100%; margin: 0; }
.toolbar-spacer { display: none; }
.plain-button { margin-left: auto; }
.plain-button + .plain-button { margin-left: 0; }
```

Commit:

```css
.latest-commit {
  display: grid;
  grid-template-columns: auto 1fr auto;
}
.commit-message { grid-column: 2/-1; }
.commit-count { grid-column: 2/-1; margin-left: 0; }
.commit-hash,
.commit-age { display: none; }
```

Arquivos:

```css
.file-row { grid-template-columns: 1fr auto; }
.file-message {
  grid-column: 1;
  color: var(--fg-muted);
  font-size: 12px;
}
.file-age {
  grid-column: 2;
  grid-row: 1/3;
  align-self: center;
}
```

Sidebar e README:

```css
.sidebar-column { grid-template-columns: 1fr; }
.markdown-body { padding: 20px; }
```

Popover:

```css
.code-popover {
  position: fixed;
  left: 16px;
  right: 16px;
  top: 130px;
  width: auto;
}
```

### 17.3 Até `520px`

```css
.repo-actions { grid-template-columns: 1fr 1fr; }
.repo-actions .segmented-button:first-child { grid-column: 1/-1; }
.hide-phone { display: none; }
.file-age { display: none; }
.file-row { grid-template-columns: 1fr; }
.footer { justify-content: flex-start; }
```

Consequências obrigatórias no baseline de `390px`:

- Watch ocupa a primeira linha inteira.
- Fork e Star dividem a segunda linha.
- `Go to file` e `Add file` desaparecem.
- idades dos arquivos desaparecem.
- sidebar fica abaixo do README.
- rodapé fica alinhado à esquerda.

---

## 18. Estados e comportamento

### 18.1 Star

Estado inicial:

- label `Star`;
- contagem superior `1.842`;
- contagem da sidebar `1.842`;
- classe ativa ausente.

Ao clicar:

- alternar classe `is-active`;
- label vira `Starred`;
- ambas as contagens viram `1.843`.

Ao clicar novamente, restaurar os valores iniciais.

### 18.2 Watch

Estado inicial: `Watch`.

Ao clicar:

- alternar classe `is-active`;
- label vira `Watching`.

Ao clicar novamente, restaurar `Watch`.

A contagem `24` não muda.

### 18.3 Tabs do repositório

- Clique remove `active` de todas e adiciona à clicada.
- Não trocar o conteúdo principal.
- Contagens permanecem visíveis.

### 18.4 Clipboard

- Usar `navigator.clipboard.writeText` quando disponível.
- Mensagens conforme seção 11.
- Não exibir toast externo.

### 18.5 Hover

Implementar somente os hovers definidos:

- links sublinham;
- icon button recebe neutral-muted;
- botões neutros recebem button-default-hover;
- tabs recebem neutral-muted;
- linha de arquivo recebe bg-muted.

Não adicionar `transform`, elevação ou mudança de escala.

---

## 19. Conteúdo canônico completo

### 19.1 Metadados

- `<title>`: `Codebase · Repositório`
- description: `Protótipo de interface de repositório inspirado no GitHub e no Primer Design System.`
- idioma: `pt-BR`

### 19.2 Identidade

- organização: `acme`
- repositório: `codebase`
- visibilidade: `Public`
- avatar principal: `AM`
- autor do commit: `ana-martins`

### 19.3 Contagens

| Métrica | Valor |
|---|---:|
| Watch | 24 |
| Fork | 263 |
| Star inicial | 1.842 |
| Star ativo | 1.843 |
| Issues | 12 |
| Pull requests | 3 |
| Branches | 4 |
| Tags | 18 |
| Commits | 146 |
| Releases | 18 |
| Contributors | 12 |

Não converter `1.842` para `1.8k` ou `1,842`.

---

## 20. Acessibilidade e semântica

A reprodução visual não deve remover a semântica existente.

Obrigatório:

- `lang="pt-BR"`.
- Botões reais para ações.
- Links reais para elementos navegáveis.
- `aria-label` nos icon buttons sem texto.
- `aria-label="Pesquisar"` no campo de busca.
- `aria-label="URL de clone"` no input de clone.
- `aria-label="Arquivos do repositório"` na tabela visual.
- `aria-label="Navegação do repositório"` no nav.
- Sprite SVG com `aria-hidden="true"`.

Não substituir botões por `<div>` clicável.

O foco pode usar o comportamento padrão do navegador; não criar um focus ring visual diferente sem atualizar este documento e os baselines.

---

## 21. Critérios de aceitação visual

### 21.1 Comparação obrigatória

Gerar capturas em:

1. `1440 × 1331`, tema claro, DPR 1.
2. `390 × 2588`, tema claro, DPR 1.

A página deve estar no topo, sem hover, sem foco, com popover fechado e estados iniciais.

### 21.2 Tolerâncias

Para o mesmo navegador e sistema:

- dimensões estruturais: tolerância `0px`;
- cores RGB: tolerância máxima de `1` por canal por anti-aliasing;
- deslocamento de ícones, cards e divisores: tolerância `0px`;
- texto: tolerância de rasterização apenas, sem mudança de wrapping;
- nenhum bloco pode mudar de linha comparado ao baseline.

Uma implementação é reprovada quando:

- a altura total da página difere em mais de `2px`;
- qualquer card, coluna ou cabeçalho difere em mais de `1px` em posição ou tamanho;
- um breakpoint é disparado em largura diferente;
- há conteúdo extra ou ausente;
- existe mudança perceptível de tipografia, stroke dos ícones, borda, raio ou fundo;
- o mobile não corresponde à ordem visual do baseline.

### 21.3 Validação funcional mínima

Testar:

- Star alterna texto e duas contagens.
- Watch alterna texto.
- Cada aba pode receber estado ativo.
- Code abre e fecha.
- Clique fora fecha Code.
- Copiar muda a mensagem e restaura após `1600ms`.
- Layouts em `1001`, `1000`, `761`, `760`, `521`, `520`, `390` e `320px` não apresentam overflow horizontal do body.

---

## 22. Checklist para agentes

Antes de declarar conclusão, o agente DEVE confirmar:

- [ ] tokens claro e escuro são idênticos;
- [ ] fonte e fallback são idênticos;
- [ ] ícones têm `16px`, stroke `1.4` e as mesmas formas;
- [ ] max-width global é `1280px`;
- [ ] sidebar desktop é `296px`;
- [ ] gutters desktop são `32px`;
- [ ] gap entre conteúdo e sidebar é `24px`;
- [ ] header global tem `64px` mínimos;
- [ ] tabs têm `48px`;
- [ ] botões principais têm `32px`;
- [ ] cards têm raio `6px`;
- [ ] os 7 arquivos e textos coincidem;
- [ ] o README coincide palavra por palavra;
- [ ] as quatro seções da sidebar coincidem;
- [ ] os breakpoints `1000`, `760` e `520` são exatos;
- [ ] a captura desktop coincide;
- [ ] a captura mobile coincide;
- [ ] estados Star, Watch, tabs e Code funcionam;
- [ ] não foi adicionada nenhuma decisão visual não documentada.

---

## 23. Regra de mudança

Qualquer alteração visual exige, na mesma mudança:

1. incrementar `spec_version`;
2. atualizar este documento;
3. gerar novos baselines desktop e mobile;
4. atualizar os hashes;
5. registrar explicitamente o que mudou.

Sem esses cinco passos, a alteração é inválida e deve ser revertida.
