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
      console.log('🔍 Buscando informações do usuário e empresa...');

      const enterprise = await this.enterpriseRepository.findById(enterpriseId);
      if (!enterprise) throw new Error(`A empresa com ID ${enterpriseId} não existe.`);

      const user = await this.userRepository.findById(userId);
      if (!user) throw new Error(`O usuário com ID ${userId} não foi encontrado.`);

      const template = await this.contractRepository.findTemplateByType(templateType);
      if (!template || !template.filePath) throw new Error(`Template do tipo ${templateType} não encontrado.`);

      const filePath = path.join(__dirname, '../../../', template.filePath);
      if (!fs.existsSync(filePath)) {
        throw new Error(`O arquivo do template não foi encontrado: ${filePath}`);
      }

      console.log('📂 Carregando template DOCX:', filePath);

      // Ler o arquivo DOCX
      const fileBuffer = fs.readFileSync(filePath);
      const zip = new PizZip(fileBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      doc.compile(); // 🔹 Compila antes de renderizar

      // 🔍 **Definição dos placeholders a serem substituídos**
      const placeholders = {
        INVESTOR: `${user.firstName} ${user.lastName}`,
        // type: enterprise.type || 'Tipo não informado',
        State: enterprise.state || 'Estado não informado',
        Country: enterprise.country || 'País não informado',
        address: enterprise.address || 'Endereço não informado',
      };

      console.log('🔄 Substituindo placeholders no contrato:', placeholders);

      doc.render(placeholders);

      const filledContractBuffer = doc.getZip().generate({ type: 'nodebuffer' });

      if (!filledContractBuffer || filledContractBuffer.length === 0) {
        throw new Error('Erro: O arquivo gerado está vazio.');
      }

      console.log('✅ Contrato preenchido, tamanho:', filledContractBuffer.length, 'bytes');

      const base64Docx = filledContractBuffer.toString('base64');

      if (!base64Docx || base64Docx.length === 0) {
        throw new Error('Erro: O contrato convertido para Base64 está vazio.');
      }

      console.log('✅ Documento convertido para Base64, tamanho:', base64Docx.length, 'bytes');

      const contract = await this.contractRepository.create({
        type: ContractType.MONEY,
        templateType,
        user: { connect: { id: userId } },
        enterprise: { connect: { id: enterpriseId } },
        filePath: template.filePath,
        status: ContractStatus.PENDING,
      });

      const accessToken = await getDocusignAccessToken();
      if (!accessToken) throw new Error('Falha ao obter o token de acesso do DocuSign.');

      console.log('📄 Criando envelope no DocuSign...');

      const envelopeId = await createEnvelopeOnDocusign({
        userId,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        enterprise,
        contract: {
          ...contract,
          content: base64Docx, // 🔥 Passa corretamente o Base64 aqui!
        },
      });

      if (!envelopeId) throw new Error('Falha ao gerar o envelope no DocuSign.');

      console.log('✅ Envelope gerado com sucesso:', envelopeId);

      await this.contractRepository.setEnvelopeId(contract.id, envelopeId);

      const signingUrl = await getEmbeddedSigningUrl({
        envelopeId,
        userId,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
      });

      if (!signingUrl) throw new Error('Erro ao gerar a URL de assinatura.');

      console.log('✅ URL de assinatura gerada com sucesso:', signingUrl);

      return { contractId: contract.id, envelopeId, signingUrl };

    } catch (error: any) {
      console.error(`❌ Erro ao gerar contrato: ${error.message}`, { stack: error.stack });
      throw new Error(`Erro ao gerar contrato: ${error.message}`);
    }
  }
}
