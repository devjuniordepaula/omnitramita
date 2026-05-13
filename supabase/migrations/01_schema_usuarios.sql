-- ==========================================
-- MIGRAÇÃO 01: USUÁRIOS, ORGANOGRAMA E PERMISSÕES
-- OmniTramita — 13/05/2026
-- ==========================================

-- ==========================================
-- 1. TABELA: orgaos
-- ==========================================
CREATE TABLE public.orgaos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    cidade TEXT,
    estado TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. TABELA: departamentos
-- ==========================================
CREATE TABLE public.departamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orgao_id UUID NOT NULL REFERENCES public.orgaos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. TABELA: setores
-- ==========================================
CREATE TABLE public.setores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    departamento_id UUID NOT NULL REFERENCES public.departamentos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. TABELA: profiles (perfil do usuário interno)
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo TEXT NOT NULL,
    cargo TEXT,
    matricula TEXT,
    orgao_id UUID REFERENCES public.orgaos(id) ON DELETE SET NULL,
    is_gestor BOOLEAN NOT NULL DEFAULT false,
    can_view BOOLEAN NOT NULL DEFAULT true,
    can_dispatch BOOLEAN NOT NULL DEFAULT false,
    can_sign BOOLEAN NOT NULL DEFAULT false,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. TABELA: profile_setores (N:N usuário <-> setor)
-- ==========================================
CREATE TABLE public.profile_setores (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    setor_id UUID NOT NULL REFERENCES public.setores(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, setor_id)
);

-- ==========================================
-- 6. TABELA: external_users (cidadãos/empresas)
-- ==========================================
CREATE TABLE public.external_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cpf_cnpj TEXT NOT NULL UNIQUE,
    tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('CPF', 'CNPJ')),
    cidade TEXT,
    estado TEXT,
    telefone TEXT,
    email TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 7. ALTERAR: external_requests (adicionar colunas)
-- ==========================================
ALTER TABLE public.external_requests
    ADD COLUMN IF NOT EXISTS external_user_id UUID REFERENCES public.external_users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS setor_destino_id UUID REFERENCES public.setores(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS departamento_destino_id UUID REFERENCES public.departamentos(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS tipo_solicitacao TEXT,
    ADD COLUMN IF NOT EXISTS motivo TEXT;

-- ==========================================
-- POLÍTICAS RLS
-- ==========================================

ALTER TABLE public.orgaos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_users ENABLE ROW LEVEL SECURITY;

-- ORGAOS: leitura pública (para o portal externo selecionar destino), escrita só autenticados
CREATE POLICY "Leitura pública de órgãos"
ON public.orgaos FOR SELECT TO public USING (true);

CREATE POLICY "Gestores podem gerenciar órgãos"
ON public.orgaos FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_gestor = true)
);

-- DEPARTAMENTOS
CREATE POLICY "Leitura pública de departamentos"
ON public.departamentos FOR SELECT TO public USING (true);

CREATE POLICY "Gestores podem gerenciar departamentos"
ON public.departamentos FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_gestor = true)
);

-- SETORES
CREATE POLICY "Leitura pública de setores"
ON public.setores FOR SELECT TO public USING (true);

CREATE POLICY "Gestores podem gerenciar setores"
ON public.setores FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_gestor = true)
);

-- PROFILES: usuário vê o próprio, gestor vê todos
CREATE POLICY "Usuário vê seu próprio perfil"
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Gestor vê todos os perfis"
ON public.profiles FOR SELECT TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_gestor = true)
);

CREATE POLICY "Gestor pode inserir perfis"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_gestor = true)
);

CREATE POLICY "Gestor pode atualizar perfis"
ON public.profiles FOR UPDATE TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_gestor = true)
);

-- PROFILE_SETORES
CREATE POLICY "Autenticados leem associações de setor"
ON public.profile_setores FOR SELECT TO authenticated USING (true);

CREATE POLICY "Gestores gerenciam associações de setor"
ON public.profile_setores FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_gestor = true)
);

-- EXTERNAL_USERS: público pode inserir, autenticados leem
CREATE POLICY "Público pode se cadastrar como usuário externo"
ON public.external_users FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Autenticados visualizam usuários externos"
ON public.external_users FOR SELECT TO authenticated USING (true);

-- ==========================================
-- TRIGGERS: atualizado_em
-- ==========================================

CREATE TRIGGER update_profiles_atualizado_em
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_external_users_atualizado_em
    BEFORE UPDATE ON public.external_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- FUNÇÃO: criar profile automaticamente quando um usuário é criado via auth
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Só cria profile se não existir (evita duplicatas)
    INSERT INTO public.profiles (id, nome_completo, is_gestor, can_view)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'is_gestor')::boolean, false),
        true
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
