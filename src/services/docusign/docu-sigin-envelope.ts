import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import { getDocusignAccessToken } from '../docusign/docu-sigin-auth';

dotenv.config();

const apiBasePath = process.env.DOCUSIGN_API_BASE_URL!;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;


export async function createEnvelopeOnDocusign({
  userId,
  enterprise,
  contract,
}: {
  userId: number;
  enterprise: any;
  contract: any;
}): Promise<string> {
  const accessToken = await getDocusignAccessToken();
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(apiBasePath);
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const signer = {
    email: 'usuario@email.com', 
    name: 'Usuário Teste', 
    recipientId: '1',
    routingOrder: '1',
    clientUserId: String(userId),
    tabs: {
      signHereTabs: [
        {
          anchorString: '/assine_aqui/',
          anchorUnits: 'pixels',
          anchorXOffset: '0',
          anchorYOffset: '0',
        },
      ],
    },
  };


  const envelopeDefinition = {
    emailSubject: `Contrato: ${contract.id}`,
    documents: [
      {
        documentBase64: Buffer.from('Contrato gerado').toString('base64'),
        name: 'Contrato.pdf',
        fileExtension: 'pdf',
        documentId: '1',
      },
    ],
    recipients: { signers: [signer] },
    status: 'sent',
  };

  
  const results = await envelopesApi.createEnvelope(accountId, { envelopeDefinition });

  return results.envelopeId ?? 'ENVELOPE_ID_NAO_DISPONIVEL';
}
