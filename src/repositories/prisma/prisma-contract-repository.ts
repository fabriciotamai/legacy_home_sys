import { prisma } from '@/lib/prisma';
import { Contract, ContractSignature, ContractStatus, ContractTemplate, ContractTemplateType, ContractType, Prisma } from '@prisma/client';
import { ContractRepository } from '../contract-repository';

export class PrismaContractRepository implements ContractRepository {

  async create(data: Prisma.ContractCreateInput): Promise<Contract> {
    return await prisma.contract.create({ data });
  }

  
  async findById(contractId: string): Promise<Contract | null> {
    return await prisma.contract.findUnique({ where: { id: contractId } });
  }

  
  async updateStatus(contractId: string, status: ContractStatus): Promise<Contract> {
    return prisma.contract.update({
      where: { id: contractId },
      data: { status },
      include: { signatures: true },
    });
  }

  
  async setEnvelopeId(contractId: string, envelopeId: string): Promise<Contract> {
    return prisma.contract.update({
      where: { id: contractId },
      data: { documentUrl: envelopeId },
    });
  }

  
  async createSignature(data: Prisma.ContractSignatureCreateInput): Promise<ContractSignature> {
    return prisma.contractSignature.create({ data });
  }

  
  async createTemplate(data: Prisma.ContractTemplateCreateInput): Promise<ContractTemplate> {
    return await prisma.contractTemplate.create({ data });
  }

  
  async listTemplates(): Promise<ContractTemplate[]> {
    return await prisma.contractTemplate.findMany();
  }

  
  async findTemplateByType(templateType: ContractTemplateType): Promise<ContractTemplate | null> {
    return await prisma.contractTemplate.findFirst({
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
  
    return await prisma.contract.create({
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
    return await prisma.contract.update({
      where: { id: contractId },
      data: { content: newContent },
    });
  }
}
