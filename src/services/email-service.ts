import formData from 'form-data';
import fs from 'fs';
import Handlebars from 'handlebars';
import juice from 'juice';
import Mailgun from 'mailgun.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Compatibilidade com __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const mailgunDomain = process.env.MAILGUN_DOMAIN || '';

export const sendEmailWithTemplate = async (
  from: string,
  to: string,
  subject: string,
  templateFilename: string,
  cssFilename: string,
  data: Record<string, any>,
): Promise<void> => {
  try {
    // Corrige os caminhos para os arquivos HTML e CSS
    const templatePath = path.resolve(__dirname, './email-templates/pages/email-confirmation', templateFilename);

    const cssPath = path.resolve(__dirname, './email-templates/pages/email-confirmation', cssFilename);

    // Logs para verificar os caminhos gerados
    console.log('HTML Template Path:', templatePath);
    console.log('CSS Path:', cssPath);

    // Lê e processa o template e CSS
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    let htmlContent = template(data);

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    htmlContent = juice.inlineContent(htmlContent, cssContent);

    // Envia o e-mail usando Mailgun
    const result = await mg.messages.create(mailgunDomain, {
      from,
      to,
      subject,
      html: htmlContent,
    });

    console.log('E-mail enviado com sucesso:', result);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    throw error;
  }
};
