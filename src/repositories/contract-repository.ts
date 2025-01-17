import { Contract, ContractSignature, ContractStatus, ContractTemplate, ContractTemplateType, Prisma } from '@prisma/client';

export interface ContractRepository {
  create(data: Prisma.ContractCreateInput): Promise<Contract>;  
  findById(contractId: string): Promise<Contract | null>;
  updateStatus(contractId: string, status: ContractStatus): Promise<Contract>;
  setEnvelopeId(contractId: string, envelopeId: string): Promise<Contract>;
  createSignature(data: Prisma.ContractSignatureCreateInput): Promise<ContractSignature>;
  createTemplate(data: Prisma.ContractTemplateCreateInput): Promise<ContractTemplate>;
  listTemplates(): Promise<ContractTemplate[]>;
  findTemplateByType(templateType: ContractTemplateType): Promise<ContractTemplate | null>;
  generateContractFromTemplate(templateId: string, userId: number, enterpriseId: number): Promise<Contract>;
  updateContractContent(contractId: string, newContent: string): Promise<Contract>;
}
