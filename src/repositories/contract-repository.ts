import {
  Contract,
  ContractSignature,
  ContractSignatureLog,
  ContractStatus,
  ContractTemplate,
  ContractTemplateType,
  Enterprise,
  Prisma,
  Role
} from '@prisma/client';

export interface ContractRepository {
  create(data: Prisma.ContractUncheckedCreateInput): Promise<Contract>;
  findById(contractId: string): Promise<Contract | null>;
  findByEnvelopeId(envelopeId: string): Promise<(Contract & { enterprise: Enterprise | null }) | null>;
  findSignatureByContractAndRole(contractId: string, role: Role): Promise<ContractSignature | null>;
  findSignatureByContractAndUserId(contractId: string, userId: number): Promise<ContractSignature | null>;
  updateStatus(contractId: string, status: ContractStatus): Promise<Contract>;
  setEnvelopeId(
    contractId: string, 
    envelopeId: string, 
    clientSigningUrl?: string, 
    adminSigningUrl?: string
  ): Promise<Contract>;

  createSignature(data: Prisma.ContractSignatureCreateInput): Promise<ContractSignature>;
  findSignatureByContractAndEmail(contractId: string, signerEmail: string): Promise<ContractSignature | null>;
  updateSignedAt(signatureId: number, signedAt: Date): Promise<ContractSignature>;
  allSignaturesCompleted(contractId: string): Promise<boolean>;
  createSignatureLog(
    contractId: string,
    userId: number | null, 
    role: Role, 
    signedAt: Date
  ): Promise<ContractSignatureLog>;

  createTemplate(data: Prisma.ContractTemplateCreateInput): Promise<ContractTemplate>;
  listTemplates(): Promise<ContractTemplate[]>; 
  findTemplateByType(templateType: ContractTemplateType): Promise<ContractTemplate | null>;
  generateContractFromTemplate(templateId: string, userId: number, enterpriseId: number): Promise<Contract>;  
  updateContractContent(contractId: string, newContent: string): Promise<Contract>;
}
