import { prisma } from '@/lib/prisma';
import {
  Contract,
  ContractSignature,
  ContractSignatureLog,
  ContractStatus,
  ContractTemplate,
  ContractTemplateType,
  ContractType,
  Enterprise,
  Prisma,
  Role,
} from '@prisma/client';
import { ContractRepository } from '../contract-repository';

export class PrismaContractRepository implements ContractRepository {
  async create(data: Prisma.ContractUncheckedCreateInput): Promise<Contract> {
    return prisma.contract.create({
      data: {
        ...data,
        userId: data.userId ?? null,
        enterpriseId: data.enterpriseId,
      },
    });
  }

  async findById(contractId: string): Promise<Contract | null> {
    return prisma.contract.findUnique({ where: { id: contractId } });
  }

  async updateStatus(contractId: string, status: ContractStatus): Promise<Contract> {
    return prisma.contract.update({
      where: { id: contractId },
      data: { status },
      include: { signatures: true },
    });
  }

  async setEnvelopeId(
    contractId: string,
    envelopeId: string,
    clientSigningUrl?: string,
    adminSigningUrl?: string
  ): Promise<Contract> {
    return prisma.contract.update({
      where: { id: contractId },
      data: {
        envelopeId,
        ...(clientSigningUrl ? { clientSigningUrl } : {}),
        ...(adminSigningUrl ? { adminSigningUrl } : {}),
      },
    });
  }

  async createSignature(data: Prisma.ContractSignatureCreateInput): Promise<ContractSignature> {
    return prisma.contractSignature.create({ data });
  }

  async findSignatureByContractAndUserId(contractId: string, userId: number): Promise<ContractSignature | null> {
    return prisma.contractSignature.findFirst({
      where: { contractId, userId },
    });
  }

  async findSignatureByContractAndRole(contractId: string, role: Role): Promise<ContractSignature | null> {
    return prisma.contractSignature.findFirst({
      where: { contractId, role },
    });
  }

  async findByEnvelopeId(envelopeId: string): Promise<(Contract & { enterprise: Enterprise | null }) | null> {
    return prisma.contract.findUnique({
      where: { envelopeId },
      include: {
        enterprise: true,
      },
    });
  }

  async findSignatureByContractAndEmail(contractId: string, signerEmail: string): Promise<ContractSignature | null> {
    return prisma.contractSignature.findFirst({
      where: {
        contractId,
        user: {
          email: signerEmail,
        },
      },
    });
  }

  async updateSignedAt(signatureId: number, signedAt: Date): Promise<ContractSignature> {
    return prisma.contractSignature.update({
      where: { id: signatureId },
      data: { signedAt },
    });
  }

  async allSignaturesCompleted(contractId: string): Promise<boolean> {
    const unsignedSignatures = await prisma.contractSignature.count({
      where: {
        contractId,
        signedAt: null,
      },
    });
    return unsignedSignatures === 0;
  }

  async createSignatureLog(
    contractId: string,
    userId: number | null,
    role: Role,
    signedAt: Date
  ): Promise<ContractSignatureLog> {
    return prisma.contractSignatureLog.create({
      data: {
        contractId,
        userId,
        role,
        signedAt,
      },
    });
  }

  async createTemplate(data: Prisma.ContractTemplateCreateInput): Promise<ContractTemplate> {
    return prisma.contractTemplate.create({ data });
  }

  async listTemplates(): Promise<ContractTemplate[]> {
    return prisma.contractTemplate.findMany();
  }

  async findTemplateByType(templateType: ContractTemplateType): Promise<ContractTemplate | null> {
    return prisma.contractTemplate.findFirst({
      where: { type: templateType },
    });
  }

  async generateContractFromTemplate(templateId: string, userId: number, enterpriseId: number): Promise<Contract> {
    const template = await prisma.contractTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template) {
      throw new Error(`Template ${templateId} não encontrado.`);
    }
    if (!template.content) {
      throw new Error(`Template ${templateId} não possui conteúdo definido.`);
    }
    let content = template.content
      .replace(/\[INVESTOR\]/g, `Usuário ${userId}`)
      .replace(/\[ENTERPRISE\]/g, `Empresa ${enterpriseId}`);

    return prisma.contract.create({
      data: {
        type: template.type === ContractTemplateType.TYPE3 ? ContractType.HYBRID : ContractType.MONEY,
        templateType: template.type,
        documentUrl: null,
        isTemplate: false,
        content,
        status: ContractStatus.PENDING,
        user: { connect: { id: userId } },
        enterprise: { connect: { id: enterpriseId } },
      },
    });
  }

  async updateContractContent(contractId: string, newContent: string): Promise<Contract> {
    return prisma.contract.update({
      where: { id: contractId },
      data: { content: newContent },
    });
  }
}
