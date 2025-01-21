import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import { getDocusignAccessToken } from './docu-sigin-auth';

dotenv.config();

const apiBasePath = process.env.DOCUSIGN_API_BASE_URL!;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;

export async function getEmbeddedSigningUrl({
  envelopeId,
  userId,
  userName,
  userEmail,
  signerType,
}: {
  envelopeId: string;
  userId: number;
  userName: string;
  userEmail: string;
  signerType: 'client' | 'admin';
}): Promise<string> {
  try {
    const accessToken = await getDocusignAccessToken();
    if (!accessToken) {
      throw new Error('❌ Falha ao obter token de acesso do DocuSign.');
    }

   
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(apiBasePath);
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);

  
    if (!envelopeId || !userId || !userName || !userEmail) {
      throw new Error(
        `❌ Dados inválidos para gerar URL de assinatura! envelopeId=${envelopeId}, userId=${userId}, userName=${userName}, userEmail=${userEmail}`
      );
    }

   
    const recipientViewRequest = {
      returnUrl: 'myapp://assinatura-concluida', 
      clientUserId: String(userId), 
      authenticationMethod: 'email',
      userName,
      email: userEmail,
    };

  
    const view = await envelopesApi.createRecipientView(accountId, envelopeId, {
      recipientViewRequest,
    });

    if (!view.url) {
      throw new Error('⚠️ Falha ao obter a URL de assinatura no DocuSign.');
    }

    return view.url;
  } catch (error: any) {
    console.error(`❌ Erro ao gerar URL de assinatura para ${signerType}:`, error.response?.data || error);

  
    if (error.response?.data) {
      throw new Error(
        `Erro inesperado ao gerar a URL de assinatura: ${JSON.stringify(error.response.data)}`
      );
    } else {
      throw new Error(`Erro inesperado ao gerar a URL de assinatura: ${error.message}`);
    }
  }
}
