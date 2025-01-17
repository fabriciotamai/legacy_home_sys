import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const privateKeyPath = process.env.DOCUSIGN_PRIVATE_KEY_PATH!;
const privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf8');

const oAuthBasePath = process.env.DOCUSIGN_AUTH_SERVER!.replace('https://', '');
const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!;
const userId = process.env.DOCUSIGN_USER_ID!;


export async function getDocusignAccessToken(): Promise<string> {
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(oAuthBasePath);

  try {
    const response = await apiClient.requestJWTUserToken(
      integrationKey,
      userId,
      ['signature', 'impersonation'],
      Buffer.from(privateKey),
      3600
    );

    return response.body.access_token;
  } catch (error: any) {
    console.error('Erro ao obter token do DocuSign:', error.response ? error.response.body : error.message);
    throw new Error('Erro ao autenticar no DocuSign.');
  }
}
