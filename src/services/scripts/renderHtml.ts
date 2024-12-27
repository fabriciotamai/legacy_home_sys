import fs from 'fs';
import juice from 'juice';
import path from 'path';
import { fileURLToPath } from 'url';

// Substituir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renderAndSaveHtml = async () => {
  try {
    // Caminho para o arquivo HTML
    const templatePath = path.join(__dirname, '../email-templates/pages/welcome.html');
    // Caminho para o arquivo CSS
    const cssPath = path.join(__dirname, '../email-templates/pages/styles.css');
    // Caminho para salvar o HTML renderizado
    const outputPath = path.join(__dirname, '../email-templates/output/rendered-inline.html');

    // Ler o HTML e CSS
    const htmlContent = fs.readFileSync(templatePath, 'utf8');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Aplicar estilos inline no HTML
    const inlineHtml = juice.inlineContent(htmlContent, cssContent);

    // Salvar o HTML renderizado
    fs.writeFileSync(outputPath, inlineHtml);
    console.log(`HTML renderizado com CSS inline salvo em: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao renderizar o HTML:', error);
  }
};

renderAndSaveHtml();
