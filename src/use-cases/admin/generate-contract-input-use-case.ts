import { ContractRepository } from '@/repositories/contract-repository';
import { EnterpriseRepository } from '@/repositories/enterprise-repository';
import { UsersRepository } from '@/repositories/user-repository';
import { getDocusignAccessToken } from '@/services/docusign/docu-sigin-auth';
import { createEnvelopeOnDocusign } from '@/services/docusign/docu-sigin-envelope';
import { getEmbeddedSigningUrl } from '@/services/docusign/docu-signin-signin';
import { ContractStatus, ContractTemplateType, ContractType } from '@prisma/client';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';

interface GenerateContractInput {
  userId: number;
  enterpriseId: number;
  templateType: ContractTemplateType;
}

interface GenerateContractOutput {
  contractId: string;
  envelopeId?: string;
  signingUrl?: string;
}

export class GenerateContractUseCase {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly userRepository: UsersRepository
  ) {}

  async execute({ userId, enterpriseId, templateType }: GenerateContractInput): Promise<GenerateContractOutput> {
    try {
      console.log('Iniciando a geração do contrato...');

      
      const enterprise = await this.enterpriseRepository.findById(enterpriseId);
      if (!enterprise) throw new Error(`A empresa com ID ${enterpriseId} não existe.`);
      console.log(`Empresa encontrada: ${enterprise.name}`);

      
      const user = await this.userRepository.findById(userId);
      if (!user) throw new Error(`O usuário com ID ${userId} não foi encontrado.`);
      console.log(`Usuário encontrado: ${user.firstName} ${user.lastName}`);

      
      const template = await this.contractRepository.findTemplateByType(templateType);
      if (!template || !template.filePath) throw new Error(`Template do tipo ${templateType} não encontrado.`);
      console.log(`Template encontrado: ${template.filePath}`);

      const filePath = path.join(process.cwd(), template.filePath);
      console.log(`Caminho completo do template: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`❌ O arquivo do template não foi encontrado: ${filePath}`);
      }
      console.log(`Caminho do template verificado: ${filePath}`);

      
      const fileBuffer = fs.readFileSync(filePath);
      const zip = new PizZip(fileBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      console.log('Template carregado com sucesso.');

      
      const placeholders: Record<string, string> = {
        investor: `${user.firstName} ${user.lastName}`, 
        state: enterprise.state || 'Estado não informado',
        country: enterprise.country || 'País não informado',
        address: enterprise.address || 'Endereço não informado',
        description: 'Descrição do investimento',
      };
      console.log('Placeholders definidos:', placeholders);

      
      doc.setData(placeholders);
      try {
        doc.render();
        console.log('Renderização do documento concluída com sucesso.');
      } catch (error: any) {
        console.error('Erro durante a renderização do documento:', error);
        throw new Error(`Erro durante a renderização do documento: ${error.message}`);
      }

      
      const filledContractBuffer = doc.getZip().generate({ type: 'nodebuffer' });

      if (!filledContractBuffer || filledContractBuffer.length === 0) {
        throw new Error('Erro: O arquivo gerado está vazio.');
      }
      console.log('Buffer do contrato preenchido gerado.');


      const generatedContractsDir = path.join(process.cwd(), 'generated-contracts');
      if (!fs.existsSync(generatedContractsDir)) {
        fs.mkdirSync(generatedContractsDir, { recursive: true });
        console.log(`Diretório criado: ${generatedContractsDir}`);
      }

      
      const filledFilePath = path.join(generatedContractsDir, `${Date.now()}-${userId}.docx`);
      fs.writeFileSync(filledFilePath, filledContractBuffer);
      console.log(`Contrato preenchido salvo em: ${filledFilePath}`);

      
      const contract = await this.contractRepository.create({
        type: ContractType.MONEY,
        templateType,
        user: { connect: { id: userId } },
        enterprise: { connect: { id: enterpriseId } },
        filePath: filledFilePath, 
        status: ContractStatus.PENDING,
      });
      console.log(`Contrato criado no banco de dados com ID: ${contract.id}`);

      
      const accessToken = await getDocusignAccessToken();
      if (!accessToken) throw new Error('Falha ao obter o token de acesso do DocuSign.');
      console.log('Token de acesso do DocuSign obtido.');

      
      const envelopeId = await createEnvelopeOnDocusign({
        userId,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        enterprise,
        contract: {
          ...contract,
          content: filledContractBuffer.toString('base64'), 
        },
      });
      console.log(`Envelope criado no DocuSign com ID: ${envelopeId}`);

      
      await this.contractRepository.setEnvelopeId(contract.id, envelopeId);
      console.log(`Envelope ID atualizado no contrato com ID: ${contract.id}`);

      
      const signingUrl = await getEmbeddedSigningUrl({
        envelopeId,
        userId,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
      });
      console.log(`URL de assinatura obtida: ${signingUrl}`);

      return { contractId: contract.id, envelopeId, signingUrl };

    } catch (error: any) {
      console.error(`❌ Erro ao gerar contrato: ${error.message}`, { stack: error.stack });
      throw new Error(`Erro ao gerar contrato: ${error.message}`);
    }
  }
}
