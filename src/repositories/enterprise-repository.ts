import { EnterpriseWithContractInterests, EnterpriseWithRelations } from '@/types';
import {
  ContractInterest,
  Enterprise,
  EnterpriseChangeType,
  EnterpriseStatus,
  InterestStatus,
  Investment,
  Prisma,
} from '@prisma/client';

interface FindAllFilters {
  status?: EnterpriseStatus;
  investmentType?: 'MONEY' | 'PROPERTY';
  isAvailable?: boolean;
}

export interface EnterpriseRepository {
  // Retorna uma Enterprise pelo seu ID (opcionalmente dentro de uma transação)
  findById(enterpriseId: number, tx?: Prisma.TransactionClient): Promise<Enterprise>;

  // Retorna uma Enterprise pelo nome
  findByName(name: string): Promise<Enterprise | null>;

  // Lista todas as Enterprises de acordo com os filtros
  findAll(filters: FindAllFilters): Promise<EnterpriseWithRelations[]>;

  // Cria uma nova Enterprise
  create(data: Prisma.EnterpriseCreateInput): Promise<Enterprise>;

  // Atualiza uma Enterprise existente
  update(enterpriseId: number, data: Prisma.EnterpriseUpdateInput): Promise<Enterprise>;

  // Atualiza o progresso geral da Enterprise (por exemplo, algum indicador numérico)
  updateEnterpriseProgress(enterpriseId: number, progress: number): Promise<void>;

  // Retorna todas as Enterprises que possuem interesses pendentes
  findWithInterests(): Promise<Enterprise[]>;

  // Retorna as Enterprises relacionadas a um determinado usuário (com informações de interesses e contratos)
  findByUserId(userId: number): Promise<EnterpriseWithContractInterests[]>;

  // Associa um usuário a uma Enterprise, criando um registro de interesse
  linkUserToEnterprise(
    userId: number,
    enterpriseId: number,
    status: InterestStatus,
    tx?: Prisma.TransactionClient
  ): Promise<ContractInterest>;

  // Remove outros interesses (define como rejeitados) que não correspondam ao interestId informado
  removeOtherInterests(enterpriseId: number, interestId: string, tx?: Prisma.TransactionClient): Promise<void>;

  // Registra um investimento feito por um usuário em uma Enterprise
  addInvestment(
    data: { userId: number; enterpriseId: number; investedAmount: number },
    tx?: Prisma.TransactionClient
  ): Promise<void>;

  // Cria múltiplos registros de imagens para uma Enterprise
  createMany(enterpriseId: number, imageUrls: string[]): Promise<void>;

  // Adiciona um log de interesse (por exemplo, para rastrear ações dos usuários)
  addInterestLog(
    data: { userId: number; enterpriseId: number; interestId: string; status: InterestStatus; reason?: string },
    tx?: Prisma.TransactionClient
  ): Promise<void>;

  // Registra uma alteração no log da Enterprise. Agora, como não utilizaremos fases ou tarefas,
  // a mudança de tipo estará limitada a 'STATUS_CHANGED'
  addChangeLog(data: {
    enterpriseId: number;
    changeType: EnterpriseChangeType | 'STATUS_CHANGED';
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;

  // Retorna o primeiro investimento registrado para uma Enterprise (caso exista)
  findSingleInvestmentByEnterpriseId(enterpriseId: number): Promise<Investment | null>;

  // Retorna as URLs de imagens associadas à Enterprise
  findByEnterpriseId(enterpriseId: number): Promise<string[]>;

  // Retorna as URLs de imagens com paginação
  findImageUrlsByEnterpriseId(enterpriseId: number, skip?: number, take?: number): Promise<string[]>;

  // Conta quantas imagens existem para uma Enterprise
  countImagesByEnterpriseId(enterpriseId: number): Promise<number>;

  // Retorna as URLs de imagens com paginação (retornando também o total)
  getPaginatedImageUrlsByEnterpriseId(
    enterpriseId: number,
    page: number,
    limit: number
  ): Promise<{ images: string[]; total: number }>;

  // Exclui uma Enterprise pelo seu ID
  deleteEnterprise(enterpriseId: number): Promise<void>;

  // Retorna todos os investimentos de uma Enterprise
  findInvestmentsByEnterpriseId(enterpriseId: number): Promise<Investment[]>;

  // Exclui imagens associadas à Enterprise
  deleteImagesByEnterprise(enterpriseId: number, imageUrls: string[]): Promise<void>;

  // Retorna o interesse aprovado para um usuário em uma Enterprise (se existir)
  findApprovedInterestByUserAndEnterprise(userId: number, enterpriseId: number): Promise<ContractInterest | null>;
}
