import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId;
  nome: string;
  email: string;
  senha: string;
  role: 'admin' | 'coordenacao' | 'professor';
  turmas?: string[];
  disciplinas?: string[];
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  compararSenha(senha: string): Promise<boolean>;
}

// Calendario Types
export interface IAvaliacaoEtapa {
  data: Date;
  instrumento: string;
  conteudo: string;
  criterios: string;
}

export interface IConsolidacao {
  data: Date;
  conteudo: string;
  criterios?: string;
}

export interface ICalendario extends Document {
  _id: Types.ObjectId;
  professor: Types.ObjectId | IUser;
  turma: string;
  disciplina: string;
  bimestre: number;
  ano: number;
  av1: IAvaliacaoEtapa;
  av2: IAvaliacaoEtapa;
  consolidacao: IConsolidacao;
  status: 'rascunho' | 'enviado' | 'aprovado';
  comentarioCoordenacao?: string;
  necessitaImpressao: boolean;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Grade Horaria Types
export interface IGradeHoraria extends Document {
  _id: Types.ObjectId;
  professor: Types.ObjectId | IUser;
  turma: string;
  disciplina: string;
  diaSemana: number;
  createdAt: Date;
  updatedAt: Date;
}

// Request with User
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'coordenacao' | 'professor';
    email: string;
  };
}

// DTOs
export interface CalendarioDTO {
  id: string;
  professor: {
    id: string;
    nome: string;
    email: string;
  };
  turma: string;
  disciplina: string;
  bimestre: number;
  ano: number;
  av1: IAvaliacaoEtapa;
  av2: IAvaliacaoEtapa;
  consolidacao: IConsolidacao;
  status: 'rascunho' | 'enviado' | 'aprovado';
  comentarioCoordenacao?: string;
  necessitaImpressao: boolean;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'coordenacao' | 'professor';
  turmas?: string[];
  disciplinas?: string[];
  ativo: boolean;
}

// Statistics
export interface CalendarioStats {
  total: number;
  rascunho: number;
  enviado: number;
  aprovado: number;
  necessitaImpressao: number;
}

// Grade Horaria Response
export interface GradeHorariaResponse {
  turma: string;
  disciplina: string;
  dias: number[];
}
