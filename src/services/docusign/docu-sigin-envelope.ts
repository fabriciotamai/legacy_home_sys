import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import { getDocusignAccessToken } from './docu-sigin-auth';

dotenv.config();


const apiBasePath = process.env.DOCUSIGN_API_BASE_URL!;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;


export async function createEnvelopeOnDocusign({
  userId,
  userEmail,
  userName,
  adminId,
  adminEmail,
  adminName,
  enterprise,
  contract,
}: {
  userId: number;
  userEmail: string;
  userName: string;
  adminId: number;
  adminEmail: string;
  adminName: string;
  enterprise: any; 
  contract: {
    content: string;         
    fileExtension?: string;  
    id: string;              
  };
}): Promise<string> {
  try {
    console.log('🔑 Obtendo token de acesso do DocuSign...');
    const accessToken = await getDocusignAccessToken();

 
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(apiBasePath);
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);

  
    const clientSigner = {
      email: userEmail,
      name: userName,
      recipientId: '1',
      clientUserId: String(userId),
      tabs: {
        signHereTabs: [
          {
            anchorString: '[CLIENT_SIGN_HERE]', 
            anchorUnits: 'pixels',
            anchorXOffset: '20',
            anchorYOffset: '-10',
          },
        ],
      },
    };

   
    const adminSigner = {
      email: adminEmail,
      name: adminName,
      recipientId: '2',
      clientUserId: String(adminId), 
      tabs: {
        signHereTabs: [
          {
            anchorString: '[ADMIN_SIGN_HERE]', 
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
          name: `Contrato.${contract.fileExtension ?? 'docx'}`,
          fileExtension: contract.fileExtension ?? 'docx',      
          documentId: '1',
        },
      ],
      recipients: {
        signers: [clientSigner, adminSigner], 
      },
      status: 'sent',
    };

    const results = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition,
    });

    if (!results || !results.envelopeId) {
      throw new Error('❌ Erro ao criar envelope no DocuSign. Nenhum ID retornado.');
    }

   
    return results.envelopeId;
  } catch (error: any) {
    throw new Error(`Erro inesperado ao criar envelope no DocuSign: ${JSON.stringify(error.response?.data)}`);
  }
}
