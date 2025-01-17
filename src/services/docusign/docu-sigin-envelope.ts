import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import { getDocusignAccessToken } from '../docusign/docu-sigin-auth';

dotenv.config();

const apiBasePath = process.env.DOCUSIGN_API_BASE_URL!;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;

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
  contract: any;
}): Promise<string> {
  try {
    console.log('🔑 Obtendo token de acesso do DocuSign...');
    const accessToken = await getDocusignAccessToken();
    console.log('✅ Token obtido com sucesso.');

    // Configurando o cliente da API do DocuSign
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(apiBasePath);
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    // Verificação do conteúdo do contrato
    if (!contract.content || typeof contract.content !== 'string') {
      throw new Error('❌ Erro: O conteúdo do contrato está vazio ou não é um Base64 válido.');
    }

    console.log('📄 Verificando se o contrato é um Base64 válido...');
    const decodedContent = Buffer.from(contract.content, 'base64').toString();

    console.log('🔍 Trecho do conteúdo decodificado:', decodedContent.slice(0, 300)); // Loga os primeiros 300 caracteres

    // Se precisar verificar âncoras no DOCX, pode fazer isso aqui (se os placeholders forem visíveis)
    if (!decodedContent.includes('[SIGN_HERE]')) {
      console.warn('⚠️ Atenção: O placeholder [SIGN_HERE] não foi encontrado no documento.');
    } else {
      console.log('✅ Placeholder [SIGN_HERE] encontrado.');
    }

    // Configuração do signer
    const signer = {
      email: userEmail,
      name: userName,
      recipientId: '1',
      routingOrder: '1',
      clientUserId: String(userId),
      tabs: {
        signHereTabs: [
          {
            anchorString: '[SIGN_HERE]', // Mantendo âncora genérica
            anchorUnits: 'pixels',
            anchorXOffset: '0',
            anchorYOffset: '0',
          },
        ],
      },
    };

    // Configuração do envelope
    const envelopeDefinition = {
      emailSubject: `Contrato para Assinatura - ID ${contract.id}`,
      documents: [
        {
          documentBase64: contract.content, // O conteúdo precisa estar em Base64
          name: 'Contrato.docx', // 🔹 Alterado para DOCX
          fileExtension: 'docx', // 🔹 Mantendo a formatação original
          documentId: '1',
        },
      ],
      recipients: { signers: [signer] },
      status: 'sent',
    };

    console.log('📄 Enviando envelope para DocuSign...');
    console.log('Payload:', JSON.stringify(envelopeDefinition, null, 2));

    // Chamada para criar o envelope
    const results = await envelopesApi.createEnvelope(accountId, { envelopeDefinition });
    console.log('✅ Envelope criado com sucesso. Envelope ID:', results.envelopeId);

    return results.envelopeId ?? 'ENVELOPE_ID_NAO_DISPONIVEL';
  } catch (error: any) {
    console.error('❌ Erro ao criar envelope no DocuSign:', error.response?.body || error.message);

    // Repassa o erro para ser tratado pelo chamador
    throw new Error(
      error.response?.body?.message || 'Erro inesperado ao criar envelope no DocuSign.'
    );
  }
}
