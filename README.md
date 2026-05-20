# TaskHub - Frontend 🎨

Uma interface moderna, responsiva e de alta performance para o sistema de gerenciamento de tarefas (TaskHub). Focada em excelente experiência do usuário (UX), atualizações otimistas e arquitetura modular.

## 💻 Tecnologias Utilizadas

* **Next.js (App Router):** Framework React para renderização otimizada, roteamento avançado e suporte nativo a Server/Client Components.
* **Tailwind CSS:** Estilização utilitária para um design clean, rápido e com suporte nativo a temas (Light/Dark Mode).
* **@hello-pangea/dnd:** Biblioteca moderna e mantida ativamente para interações robustas de Drag-and-Drop (substituindo o obsoleto `react-beautiful-dnd`).
* **Lucide React & Framer Motion:** Biblioteca de ícones elegantes e animações fluidas para transições de modais e componentes.

## 🧠 Decisões Arquiteturais e UX

1. **Atualização Otimista (Optimistic UI) no Kanban:** Ao arrastar um card entre as colunas, a interface atualiza o estado imediatamente para o usuário, enquanto a requisição `PUT` acontece em segundo plano. Isso elimina a sensação de lentidão e engasgos.

2. **Centralização de API (`apiFetch`):** Foi criado um *wrapper* customizado para as requisições HTTP (`src/lib/api.ts`). Ele intercepta todas as chamadas, injeta o token JWT e desloga o usuário automaticamente caso a API retorne erro `401 Unauthorized`.

3. **Modais ao invés de Rotas:** Para melhorar a fluidez, a criação e edição de tarefas, bem como a edição de perfil, acontecem via Modais sobrepostos ao Dashboard, evitando recarregamentos desnecessários de página.

4. **Substituição inteligente de dependências:** O uso do `@hello-pangea/dnd` garante compatibilidade total com as versões mais recentes do React (18/19), evitando bugs de compatibilidade comuns em bibliotecas antigas de drag-and-drop.

## ✅ Status dos Requisitos

| Requisito do Desafio | Status | Implementação |
|---|:---:|---|
| **Login / Cadastro** | 🟢 | Fluxo em página única com validação e redirect automático. |
| **Listagem de Tarefas** | 🟢 | Alternância fluida entre visualização em **Lista** e **Kanban Board**. |
| **Criação / Edição** | 🟢 | Modais reaproveitáveis conectados aos endpoints `POST` e `PUT`. |
| **Marcar como concluída** | 🟢 | Checkbox interativo e botões de ação direta nos cards. |
| **Filtro (Título/Status)** | 🟢 | Busca em tempo real por texto, status e prioridades. |
| **Integração com Backend** | 🟢 | Consumo completo da API RESTful com tratamento de erros. |
| **Armazenamento JWT** | 🟢 | Token armazenado com segurança e anexado nos Headers. |

## 🌟 Bônus e Entregas Extras (Overdelivery)

| Feature | Status | Detalhes |
|---|:---:|---|
| **Tema Claro/Escuro** | 🟢 | Toggle funcional persistido entre sessões. |
| **Widget de Clima** | 🟢 | Integrado com a API do OpenWeather via rota interna do Next.js. |
| **Layout Responsivo** | 🟢 | Design *mobile-first*, Sidebar retrátil e adaptação de grids. |
| **Gerenciamento de Perfil** | 🟢 | Modal para alteração de Nome e troca segura de Senha. |
| **Módulo de Equipe** | 🟢 | Visualização limpa listando os outros usuários do sistema. |
| **Sistema de Prioridades** | 🟢 | Mapeamento visual em cores (Alta=Vermelho, Média=Amarelo, Baixa=Azul). |

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (v18+)
* API do Backend rodando localmente (porta `3001`) ou hospedada na nuvem.

### Passos

```bash
# 1. Clone o repositório
git clone [https://github.com/SEU_USUARIO/taskhub-frontend.git](https://github.com/SEU_USUARIO/taskhub-frontend.git)
cd taskhub-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env.local na raiz do projeto contendo:
NEXT_PUBLIC_API_URL="http://localhost:3001"  # Ou a URL da sua API em produção
OPENWEATHER_API_KEY="sua-chave-do-openweather"
WEATHER_INSECURE_TLS="true"

# 4. Inicie o servidor de desenvolvimento
npm run dev