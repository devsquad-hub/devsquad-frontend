# Dicionário de Dados - DevSquad Hub

Este documento descreve a arquitetura de banco de dados (PostgreSQL/Supabase) do projeto, organizada por módulos conforme o padrão de sistemas enterprise.

## 📌 Padrões de Nomenclatura
- **Schemas:** `public`
- **Tabelas/Colunas:** `snake_case` (minúsculo)
- **Prefixos:**
    - `CM_` (Common): Identidade, Perfis e Permissões.
    - `PJ_` (Projects): Cadastro e detalhes de projetos.
    - `SQ_` (Squads): Fluxo de candidaturas e times.
    - `AU_` (Audit): Logs de rastreabilidade.

---

## Módulos e Tabelas

### 🟢 Módulo CM (Common) - Identidade e Acesso
| Tabela | Descrição |
| :--- | :--- |
| `cm_user` | Entidade central vinculada ao Auth. Armazena status e auditoria de cargos. |
| `cm_profile` | Extensão biográfica (Nome, CPF, Bio). |
| `cm_status` | Domínio de estados do usuário (Ativo, Suspenso, etc). |
| `cm_role` | Definição de papéis (Admin, Lead, Member). |
| `cm_user_role` | Tabela associativa (N:N) para permissões (RBAC). |
| `cm_user_links` | Repositório de links externos (GitHub, LinkedIn). |

### 🔵 Módulo PJ (Projects) - Gestão de Projetos
| Tabela | Descrição |
| :--- | :--- |
| `pj_project` | Cadastro principal de projetos, stacks e níveis de dificuldade. |
| `pj_project_compl` | Permite múltiplos responsáveis (Owners) por um único projeto. |

### 🟡 Módulo SQ (Squads) - Candidaturas
| Tabela | Descrição |
| :--- | :--- |
| `sq_application` | Registro de interesse do membro em um projeto (Matrícula). |
| `sq_status` | Workflow da candidatura (Pendente, Aprovado, Recusado). |

### 🔴 Módulo AU (Audit) - Rastreabilidade
| Tabela | Descrição |
| :--- | :--- |
| `au_log` | Log centralizado que registra `old_data` e `new_data` de todas as entidades em JSONB. |

---

## 🔐 Auditoria Obrigatória
Todas as tabelas de negócio devem preencher obrigatoriamente:
- `created_by` / `created_at`
- `updated_by` / `updated_at` (quando aplicável)

---

## 🚀 Como Conectar
Solicite a **Connection String** e as **Chaves de API** diretamente ao Thiago.
