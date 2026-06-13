export type Orgao = {
  id: string
  nome: string
  cnpj: string | null
  cidade: string | null
  estado: string | null
  criado_em?: string
  created_at?: string
}

export type Departamento = {
  id: string
  orgao_id: string
  nome: string
  descricao: string | null
  criado_em?: string
  orgaos?: Orgao
}

export type Setor = {
  id: string
  departamento_id: string
  nome: string
  descricao: string | null
  criado_em?: string
  departamentos?: Departamento
}

export type Profile = {
  id: string
  full_name: string | null
  nome_completo: string | null
  email: string | null
  cargo: string | null
  matricula: string | null
  orgao_id: string | null
  is_gestor: boolean
  can_view: boolean
  can_dispatch: boolean
  can_sign: boolean
  ativo: boolean | null
  criado_em?: string
  atualizado_em?: string
  created_at?: string
  updated_at?: string
  orgaos?: Orgao
  profile_setores?: { setor_id: string; setores?: Setor }[]
}

export type ExternalUser = {
  id: string
  nome: string
  cpf_cnpj: string
  tipo_documento: 'CPF' | 'CNPJ'
  cidade: string | null
  estado: string | null
  telefone: string | null
  email: string | null
  criado_em?: string
}

export type ExternalRequest = {
  id: string
  tracking_code: string
  title: string
  description: string | null
  applicant_name: string
  applicant_email: string
  status: string
  tipo_solicitacao: string | null
  motivo: string | null
  external_user_id: string | null
  setor_destino_id: string | null
  departamento_destino_id: string | null
  internal_document_id: string | null
  created_at: string
  updated_at: string
  setores?: Setor
  departamentos?: Departamento
  external_users?: ExternalUser
}