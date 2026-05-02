-- ==========================================
-- SCRIPT DE INICIALIZAÇÃO: OMNITRAMITA
-- ==========================================

-- Habilitar a extensão pgcrypto para gerar UUIDs e senhas (se não estiver ativa)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABELA: documents (Processos e Documentos Internos)
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- Ex: 'Ofício', 'Requerimento', 'Memorando'
    priority TEXT NOT NULL DEFAULT 'Normal', -- Ex: 'Baixa', 'Normal', 'Alta', 'Urgente'
    status TEXT NOT NULL DEFAULT 'distribuir', -- Ex: 'distribuir', 'analise', 'assinatura', 'pronto'
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Relaciona com o usuário logado
    assignee_name TEXT, -- Opcional, cache do nome para visualização rápida
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA: external_requests (Solicitações de Usuários Externos - Fase 5)
CREATE TABLE public.external_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code TEXT UNIQUE NOT NULL, -- Código de protocolo (ex: OMNI-2026-XYZ)
    title TEXT NOT NULL,
    description TEXT,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente', -- Ex: 'pendente', 'em_andamento', 'concluido'
    internal_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL, -- Documento gerado após triagem
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- ==========================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para 'documents'
-- 1. Usuários autenticados podem ver todos os documentos
CREATE POLICY "Usuários autenticados podem visualizar documentos" 
ON public.documents FOR SELECT 
TO authenticated 
USING (true);

-- 2. Usuários autenticados podem inserir documentos
CREATE POLICY "Usuários autenticados podem inserir documentos" 
ON public.documents FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 3. Usuários autenticados podem atualizar documentos (ex: mover no Kanban)
CREATE POLICY "Usuários autenticados podem atualizar documentos" 
ON public.documents FOR UPDATE 
TO authenticated 
USING (true);

-- Políticas para 'external_requests'
-- 1. Qualquer pessoa (anon) pode criar uma solicitação
CREATE POLICY "Acesso público para criar solicitações" 
ON public.external_requests FOR INSERT 
TO public 
WITH CHECK (true);

-- 2. Qualquer pessoa (anon) pode consultar sua própria solicitação usando o código
CREATE POLICY "Acesso público para consultar protocolo" 
ON public.external_requests FOR SELECT 
TO public 
USING (true); -- Na aplicação, filtraremos por tracking_code

-- 3. Usuários autenticados (internos) podem ver e atualizar solicitações
CREATE POLICY "Usuários internos podem gerenciar solicitações" 
ON public.external_requests FOR ALL 
TO authenticated 
USING (true);

-- ==========================================
-- TRIGGERS DE ATUALIZAÇÃO (updated_at)
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
    BEFORE UPDATE ON public.external_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
