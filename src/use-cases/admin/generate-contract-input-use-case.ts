import { ContractRepository } from '@/repositories/contract-repository';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { createEnvelopeOnDocusign } from '@/services/docusign/docu-sigin-envelope';
import { getEmbeddedSigningUrl } from '@/services/docusign/docu-signin-signin';
import {
  ContractStatus,
  ContractTemplateType,
  ContractType,
  Role,
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
      // 1) Verifica se a empresa e o usuário existem e se há interesse aprovado
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

    

      const fileBuffer = fs.readFileSync(filePath);
      const zip = new PizZip(fileBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      doc.render({
        investor: `${user.firstName} ${user.lastName}`,
        state: enterprise.state || 'Estado não informado',
        country: enterprise.country || 'País não informado',
        address: enterprise.address || 'Endereço não informado',
        description: 'Descrição do investimento',
      });

      const filledContractBuffer = doc.getZip().generate({ type: 'nodebuffer' });
      if (!filledContractBuffer || filledContractBuffer.length === 0) {
        throw new Error('Erro: Arquivo gerado está vazio.');
      }

      // 3) Salva arquivo localmente
      const generatedContractsDir = path.join(process.cwd(), 'generated-contracts');
      if (!fs.existsSync(generatedContractsDir)) {
        fs.mkdirSync(generatedContractsDir, { recursive: true });
      }

      const filledFilePath = path.join(generatedContractsDir, `${Date.now()}-${userId}.docx`);
      fs.writeFileSync(filledFilePath, filledContractBuffer);

      // 4) Cria o registro de Contract no banco
      const contract = await this.contractRepository.create({
        type: ContractType.MONEY,
        templateType,
        userId,
        enterpriseId,
        filePath: filledFilePath,
        status: ContractStatus.PENDING,
      });

      // 4.1) Cria as assinaturas para o cliente e o admin
      await this.contractRepository.createSignature({
        contract: { connect: { id: contract.id } },
        user: { connect: { id: userId } },
        role: Role.USER,
      });

      await this.contractRepository.createSignature({
        contract: { connect: { id: contract.id } },
        user: { connect: { id: adminId } },
        role: Role.ADMIN,
      });

      // 5) Cria Envelope no DocuSign
      const envelopeId = await createEnvelopeOnDocusign({
        userId,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        adminId,
        adminEmail,
        adminName,
        enterprise,
        contract: {
          id: contract.id,
          content: filledContractBuffer.toString('base64'),
          fileExtension: 'docx',
        },
      });

      // 6) Gera os URLs de assinatura
      const [clientSigningUrl, adminSigningUrl] = await Promise.all([
        getEmbeddedSigningUrl({
          envelopeId,
          userId,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          signerType: 'client',
        }),
        getEmbeddedSigningUrl({
          envelopeId,
          userId: adminId,
          userName: adminName,
          userEmail: adminEmail,
          signerType: 'admin',
        }),
      ]);

      
      await this.contractRepository.setEnvelopeId(
        contract.id,
        envelopeId,
        clientSigningUrl,
        adminSigningUrl
      );

      console.log(`✅ Contrato ${contract.id} criado com envelope ${envelopeId}`);

      return {
        contractId: contract.id,
        envelopeId,
        clientSigningUrl,
        adminSigningUrl,
      };
    } catch (error: any) {
      console.error(`❌ Erro ao gerar contrato: ${error.message}`);
      throw new Error(`Erro ao gerar contrato: ${error.message}`);
    }
  }
}
