import docusign from 'docusign-esign';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();


const requiredEnvVars = [
  'DOCUSIGN_PRIVATE_KEY_PATH',
  'DOCUSIGN_AUTH_SERVER',
  'DOCUSIGN_INTEGRATION_KEY',
  'DOCUSIGN_USER_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Erro: A variável de ambiente ${envVar} não está definida.`);
  }
}


const privateKeyPath = process.env.DOCUSIGN_PRIVATE_KEY_PATH!;
let privateKey: string;

try {
  privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf8');
} catch (error) {
  throw new Error(`❌ Erro ao ler a chave privada: Verifique se o arquivo ${privateKeyPath} existe e está acessível.`);
}


const oAuthBasePath = process.env.DOCUSIGN_AUTH_SERVER!;
const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!;
const userId = process.env.DOCUSIGN_USER_ID!;

export async function getDocusignAccessToken(): Promise<string> {
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(oAuthBasePath.replace('https://', ''));

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
    console.error('❌ Erro ao obter token do DocuSign:', error);

    if (error.response) {
      console.error('🔍 Detalhes do erro:', error.response.body);

      if (error.response.status === 401) {
        throw new Error('❌ Erro 401: Credenciais inválidas. Verifique sua chave privada, Integration Key e User ID.');
      }
      if (error.response.status === 403) {
        throw new Error('❌ Erro 403: Permissões insuficientes. Verifique se seu usuário tem permissão para usar JWT.');
      }
    }

    throw new Error('Erro ao autenticar no DocuSign.');
  }
}
