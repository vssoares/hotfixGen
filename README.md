# projectManager

Interface gráfica para gerenciar o fluxo de hotfixes e criação de branches seguindo o **Git Flow**, construída com Electron + React.

---

## O que é

O **projectManager** é um aplicativo desktop para Windows que automatiza comandos Git do dia a dia — especificamente o ciclo de vida de hotfixes e a criação de feature branches — sem que o desenvolvedor precise abrir o terminal.

---

## Funcionalidades

### Modo Hotfix
Executa os três estágios do fluxo de hotfix via `git flow`:

| Ação | O que faz |
|------|-----------|
| **START** | Atualiza `master` e `develop`, depois inicia um hotfix com `git flow hotfix start <versão>` |
| **FINISH** | Atualiza `master` e `develop`, finaliza o hotfix com `git flow hotfix finish <versão>` e faz push automático |
| **DELETE** | Atualiza `master` e `develop`, remove o hotfix com `git flow hotfix delete <versão>` |

### Modo New Branch
Cria uma feature branch a partir de `develop` no formato:

```
feature/<tipo>-[us]-<nome>
```

Tipos disponíveis: `sustentacao`, `manutencao`, `votorantim`, `vcmonitoramento`

### Outras funcionalidades
- Seletor de projetos com suporte a projetos customizados (adicionar/remover)
- Abertura do `gitk master` para visualização do histórico
- Console de saída em tempo real com todos os logs do Git
- Tema claro/escuro
- Atualização automática — notifica quando há nova versão disponível e permite baixar e instalar sem sair do app

---

## Sobre os comandos executados

> **Os comandos executados pelo app são 100% operações Git e não causam nenhum dano à máquina do usuário.**

O app executa internamente um script PowerShell (`hf.ps1`) que realiza exclusivamente:

- `git fetch --all` — busca atualizações remotas
- `git checkout` / `git pull` — troca de branch e atualização local
- `git flow hotfix start/finish/delete` — gerenciamento do fluxo de hotfix
- `git checkout -b` — criação de nova branch

Nenhum arquivo do sistema é modificado, nenhum dado é enviado para servidores externos (exceto o próprio repositório Git configurado no projeto), e nenhum processo é executado fora do contexto Git.

O script roda com `-ExecutionPolicy Bypass` apenas para permitir a execução do arquivo `.ps1` sem necessidade de assinar o script — isso é padrão em ferramentas de automação Git no Windows e **não altera a política de execução global do PowerShell** da máquina.

---

## Requisitos

- Windows 10 ou superior
- [Git](https://git-scm.com/) instalado e disponível no PATH
- [git-flow](https://github.com/nvie/gitflow) instalado (`git flow init` já configurado nos projetos)
- `gitk` instalado (geralmente incluído na instalação do Git para Windows)

---

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Gerar build para Windows
npm run build
```

---

## Tecnologias

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [electron-updater](https://www.electron.build/auto-update)
