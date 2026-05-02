# Status do Projeto: OmniTramita

## 📌 Onde Estamos (O que já foi feito)

1. **Configuração Base e Autenticação (Supabase)**
   - Resolução de problemas críticos de login e falhas de verificação de e-mail.
   - Substituição de chaves de API inválidas por credenciais válidas do Supabase.
   - Implementação da rota de callback (`/auth/callback`) para processamento seguro da verificação de e-mail.
   - Estruturação do pipeline de autenticação utilizando sessões, Middlewares do Next.js e Server Actions seguras.

2. **Planejamento do Dashboard**
   - Elaboração do plano de implementação inicial (`implementation_plan_dashboard`).
   - Definição da arquitetura visual do dashboard para usuários não-técnicos, focada em alta usabilidade e dividida em três pilares:
     - **O Controlador:** Grid de KPIs e visão instantânea.
     - **O Gerente:** Sistema Kanban para atribuição de tarefas.
     - **O Mapeador:** Radar de rastreabilidade e processamento em lote.

---

## 📍 Estado Atual (Pausa - 02/05/2026)

- **O que está pronto:** 
  - A base de autenticação do sistema está sólida.
  - **Fase 1 e 2:** Layout principal do dashboard e a visão Kanban criados (mantivemos o Kanban estático por enquanto a pedido).
  - **Fase 3:** A página `/processos` está com uma tabela de dados avançada (`@tanstack/react-table`) funcionando visualmente.
  - **Fase 5:** Portal de solicitações externas criado na rota `/solicitar` com formulário validado.
  - **Fase 6:** Interface do Chatbot (Omni) criada na tela de solicitações, integrando o pacote `ai` (Vercel AI SDK).

- **O que está pendente (Atenção para o seu retorno!):**
  1. **Chatbot (Chave de API):** É necessário gerar uma chave no Google AI Studio e adicionar `GOOGLE_GENERATIVE_AI_API_KEY=sua-chave` no arquivo `.env.local` para a IA funcionar.
  2. **Banco de Dados:** O script SQL já foi criado. É preciso ir no painel do Supabase, rodar o `supabase/migrations/00_schema_inicial.sql` e gerar as tabelas.

---

## 🚀 Para Onde Vamos (Próximos Passos no Retorno)

### Fase 4: Integração com o Banco de Dados (Supabase)
- O passo principal no nosso retorno será conectar todas as belas interfaces que já construímos (Dashboard, Kanban, Data Table e Formulário de Solicitação) aos dados reais que estarão no banco. 
- Criaremos funções no frontend para buscar, inserir e atualizar documentos utilizando o cliente do Supabase e as regras RLS.

---

**Resumo:** Toda a estrutura visual (UI/UX) para o Dashboard e para o Portal Externo está concluída! Quando você retornar, nosso foco será ligar o "motor" do sistema (banco de dados e chamadas à API).
