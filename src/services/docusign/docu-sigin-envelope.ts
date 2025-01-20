import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import { getDocusignAccessToken } from '../docusign/docu-sigin-auth';

dotenv.config();


const apiBasePath = process.env.DOCUSIGN_API_BASE_URL;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

if (!apiBasePath) {
  throw new Error('❌ Erro: A variável de ambiente DOCUSIGN_API_BASE_URL não está definida.');
}

if (!accountId) {
  throw new Error('❌ Erro: A variável de ambiente DOCUSIGN_ACCOUNT_ID não está definida.');
}


const safeApiBasePath: string = apiBasePath;
const safeAccountId: string = accountId;


function isValidBase64(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  try {
    return Buffer.from(str, 'base64').toString('utf-8') !== '';
  } catch (error) {
    return false;
  }
}

export async function createEnvelopeOnDocusign({
  userId,
  userEmail,
  userName,
  enterprise,
  contract,
}: {
  userId: number;
  userEmail: string;
  userName: string;
  enterprise: any;
  contract: { content: string; fileExtension?: string; id: string }; 
}): Promise<string> {
  try {
    console.log('🔑 Obtendo token de acesso do DocuSign...');
    const accessToken = await getDocusignAccessToken();
   

    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(safeApiBasePath);
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);

   
    if (!isValidBase64(contract.content)) {
      throw new Error('❌ Erro: O contrato não está em um formato Base64 válido.');
    }

    console.log('📄 Validando o documento...');

    const signer = {
      email: userEmail,
      name: userName,
      recipientId: '1',
      routingOrder: '1',
      clientUserId: String(userId),
      tabs: {
        signHereTabs: [
          {
            anchorString: '[SIGN_HERE]',
            anchorUnits: 'pixels',
            anchorXOffset: '20',
            anchorYOffset: '-10',
          },
        ],
      },
    };

    const envelopeDefinition = {
      emailSubject: `Contrato para Assinatura - ID ${contract.id}`,
      documents: [
        {
          documentBase64: contract.content,
          name: 'Contrato.docx',
          fileExtension: contract.fileExtension || 'docx', 
          documentId: '1',
        },
      ],
      recipients: { signers: [signer] },
      status: 'sent',
    };

    console.log('📄 Enviando envelope para DocuSign...');
    const results = await envelopesApi.createEnvelope(safeAccountId, { envelopeDefinition });

    if (!results || !results.envelopeId) {
      throw new Error('❌ Erro ao criar envelope no DocuSign. Nenhum ID retornado.');
    }

    console.log('✅ Envelope criado com sucesso. Envelope ID:', results.envelopeId);
    return results.envelopeId;
  } catch (error: any) {
    console.error('❌ Erro ao criar envelope no DocuSign:', error);

    if (error.response?.status === 401) {
      throw new Error('❌ Erro 401: Token inválido. Verifique suas credenciais do DocuSign.');
    }
    if (error.response?.status === 403) {
      throw new Error('❌ Erro 403: Permissão negada. O usuário pode não ter acesso para criar envelopes.');
    }
    if (error.response?.status >= 500) {
      throw new Error('❌ Erro 500+: Problema no servidor do DocuSign.');
    }

    throw new Error('Erro inesperado ao criar envelope no DocuSign.');
  }
}
