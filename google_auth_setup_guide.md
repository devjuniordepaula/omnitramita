# 🚀 Guia de Configuração: Login com o Google (OAuth2)

Excelente ideia! Adicionar o Login com o Google simplifica muito a vida dos utilizadores e evita os problemas de e-mails não recebidos. 

Já adicionei os **botões oficiais do Google** tanto na página de login como na de registo, e já os liguei ao Supabase (`signInWithOAuth`). 

No entanto, o Google não permite que qualquer site use o seu login sem autorização prévia. **Para que o botão funcione, tem de fazer a configuração abaixo**.

---

## 🛠️ Passo 1: Configurar a Google Cloud (Obter as chaves)

1. Aceda à **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Crie um novo projeto (ou selecione um existente) e dê-lhe o nome "OmniTramita".
3. No menu lateral esquerdo, vá a **APIs & Services (APIs e Serviços)** → **OAuth consent screen (Ecrã de consentimento OAuth)**.
   - Escolha **External (Externo)** e clique em **Create**.
   - Preencha os dados obrigatórios (Nome da App: "OmniTramita", o seu e-mail, etc.).
   - Pode avançar os passos de "Scopes" e "Test users" (basta clicar em *Save and Continue* até ao fim).
   - No final, clique em **Publish App (Publicar Aplicação)** para que qualquer pessoa com conta Google consiga entrar.
4. Ainda no menu lateral, vá a **Credentials (Credenciais)**.
5. Clique em **+ CREATE CREDENTIALS (CRIAR CREDENCIAIS)** no topo da página e escolha **OAuth client ID**.
6. Em **Application type**, selecione **Web application**.
7. Dê um nome, por exemplo: "Supabase Auth".
8. **⚠️ O MAIS IMPORTANTE: Os URLs autorizados**
   - Na secção **Authorized JavaScript origins**, adicione o URL do seu projeto Supabase:
     ```
     https://mlxpxzdivzrmshykxzlr.supabase.co
     ```
   - Na secção **Authorized redirect URIs**, adicione a rota exata de callback do Supabase:
     ```
     https://mlxpxzdivzrmshykxzlr.supabase.co/auth/v1/callback
     ```
9. Clique em **Create (Criar)**.
10. O Google vai mostrar-lhe duas coisas:
    - O seu **Client ID** (ID do Cliente)
    - O seu **Client Secret** (Segredo do Cliente)
    *(Guarde estes dois valores ou deixe a janela aberta)*

---

## ⚙️ Passo 2: Configurar o Supabase

1. Aceda ao seu painel no **[Supabase](https://supabase.com/dashboard)**.
2. Selecione o projeto **OmniTramita**.
3. Vá a **Authentication** → **Providers** (no menu da esquerda).
4. Encontre o **Google** na lista e clique nele.
5. Ative a opção **"Enable Sign in with Google"**.
6. Cole o **Client ID** e o **Client Secret** que copiou da Google.
7. Clique em **Save**.

---

## ✅ Passo 3: Testar!

1. Na sua aplicação (`http://localhost:3000/login` ou `/register`), clique no novo botão **"Continuar com o Google"**.
2. Será reencaminhado para o ecrã de login seguro da Google.
3. Escolha a sua conta.
4. Será devolvido à sua aplicação já autenticado e com a sessão iniciada!

> [!TIP]
> **Como funciona:** O código que eu criei no front-end (`signInWithOAuth`) avisa o Supabase que queremos usar o Google. O Supabase reencaminha o utilizador para a Google. A Google valida o utilizador e envia-o de volta para a rota `/auth/v1/callback` do Supabase. O Supabase cria o utilizador na sua base de dados e finalmente reencaminha-o para a nossa rota local (`/auth/callback`), entrando no sistema.
