import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import { getDocusignAccessToken } from '../docusign/docu-sigin-auth';

dotenv.config();

const apiBasePath = process.env.DOCUSIGN_API_BASE_URL!;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;


export async function getEmbeddedSigningUrl({
  envelopeId,
  userId,
  userName,
  userEmail,
}: {
  envelopeId: string;
  userId: number;
  userName: string;
  userEmail: string;
}): Promise<string> {
  const accessToken = await getDocusignAccessToken();
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(apiBasePath);
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const recipientViewRequest = {
    returnUrl: 'http://seusistema.com/aposAssinar',
    clientUserId: String(userId),
    authenticationMethod: 'none',
    userName,
    email: userEmail,
  };

  const view = await envelopesApi.createRecipientView(accountId, envelopeId, { recipientViewRequest });

  if (!view.url) {
    throw new Error('Falha ao obter a URL de assinatura no DocuSign.');
  }
  
  return view.url;
}
