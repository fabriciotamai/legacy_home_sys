import { ContractRepository } from '@/repositories/contract-repository';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { createEnvelopeOnDocusign } from '@/services/docusign/docu-sigin-envelope';
import { getEmbeddedSigningUrl } from '@/services/docusign/docu-signin-signin';
import {
  ContractStatus,
  ContractTemplateType,
  ContractType,
} from '@prisma/client';

import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';


interface GenerateContractInput {
  userId: number;
  enterpriseId: number;
  templateType: ContractTemplateType;
  adminId: number;
  adminEmail: string;
  adminName: string;
}

interface GenerateContractOutput {
  contractId: string;
  envelopeId: string;
  clientSigningUrl: string;
  adminSigningUrl: string;
}

export class GenerateContractUseCase {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    enterpriseId,
    templateType,
    adminId,
    adminEmail,
    adminName,
  }: GenerateContractInput): Promise<GenerateContractOutput> {
    try {
      
      const enterprise = await this.enterpriseRepository.findById(enterpriseId);
      if (!enterprise) throw new Error(`Empresa ID ${enterpriseId} não existe.`);

      const user = await this.userRepository.findById(userId);
      if (!user) throw new Error(`Usuário ID ${userId} não encontrado.`);

      const interest = await this.enterpriseRepository.findApprovedInterestByUserAndEnterprise(userId, enterpriseId);
      if (!interest) throw new Error('Usuário sem interesse aprovado para esta empresa.');

      console.log(`✅ Interesse aprovado para usuário ${userId} na empresa ${enterpriseId}.`);


      const template = await this.contractRepository.findTemplateByType(templateType);
      if (!template || !template.filePath) throw new Error(`Template ${templateType} não encontrado.`);

      const filePath = path.join(process.cwd(), template.filePath);
      if (!fs.existsSync(filePath)) throw new Error(`Arquivo template não encontrado: ${filePath}`);

      console.log(`📄 Carregando template: ${filePath}`);

      const fileBuffer = fs.readFileSync(filePath);
      const zip = new PizZip(fileBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const placeholders = {
        investor: `${user.firstName} ${user.lastName}`,
        state: enterprise.state || 'Estado não informado',
        country: enterprise.country || 'País não informado',
        address: enterprise.address || 'Endereço não informado',
        description: 'Descrição do investimento',
      };
  

      doc.render(placeholders);
     
      const filledContractBuffer = doc.getZip().generate({ type: 'nodebuffer' });
      if (!filledContractBuffer || filledContractBuffer.length === 0) throw new Error('Erro: Arquivo gerado está vazio.');

      const generatedContractsDir = path.join(process.cwd(), 'generated-contracts');
      if (!fs.existsSync(generatedContractsDir)) fs.mkdirSync(generatedContractsDir, { recursive: true });

      const filledFilePath = path.join(generatedContractsDir, `${Date.now()}-${userId}.docx`);
      fs.writeFileSync(filledFilePath, filledContractBuffer);

      const contract = await this.contractRepository.create({
        type: ContractType.MONEY,
        templateType,
        user: { connect: { id: userId } },
        enterprise: { connect: { id: enterpriseId } },
        filePath: filledFilePath,
        status: ContractStatus.PENDING,
      });

      const envelopeId = await createEnvelopeOnDocusign({
        userId,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        adminId,
        adminEmail,
        adminName,
        enterprise,
        contract: {
          ...contract,
          content: filledContractBuffer.toString('base64'),
          fileExtension: 'docx',
        },
      });

    
      const clientSigningUrl = await getEmbeddedSigningUrl({
        envelopeId,
        userId,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        signerType: 'client',
      });
  

      const adminSigningUrl = await getEmbeddedSigningUrl({
        envelopeId,
        userId: adminId,
        userName: adminName,
        userEmail: adminEmail,
        signerType: 'admin',
      });
 
      await this.contractRepository.setEnvelopeId(
        contract.id,
        envelopeId,
        clientSigningUrl,
        adminSigningUrl
      );
    
      return {
        contractId: contract.id,
        envelopeId,
        clientSigningUrl,
        adminSigningUrl,
      };
    } catch (error: any) {
      throw new Error(`Erro ao gerar contrato: ${error.message}`);
    }
  }
}

