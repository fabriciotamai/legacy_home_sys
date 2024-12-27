import formData from 'form-data';
import fs from 'fs';
import Handlebars from 'handlebars';
import juice from 'juice';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const mailgunDomain = process.env.MAILGUN_DOMAIN || '';

/**
 * Função para enviar e-mails com template e CSS inline
 * @param from - Endereço do remetente
 * @param to - Endereço do destinatário
 * @param subject - Assunto do e-mail
 * @param templatePath - Caminho do arquivo HTML do template
 * @param cssPath - Caminho do arquivo CSS do template
 * @param data - Dados dinâmicos para substituir no template (ex.: { username, actionUrl })
 */
export const sendEmailWithTemplate = async (
  from: string,
  to: string,
  subject: string,
  templatePath: string,
  cssPath: string,
  data: Record<string, any>,
): Promise<void> => {
  try {
    // Ler e compilar o template com Handlebars
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    let htmlContent = template(data);

    // Ler o CSS e aplicar como inline styles no HTML
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    htmlContent = juice.inlineContent(htmlContent, cssContent);

    // Enviar o e-mail via Mailgun
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
