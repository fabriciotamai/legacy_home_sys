import fs from 'fs';
import juice from 'juice';
import path from 'path';

const renderAndSaveHtml = async () => {
  try {
    const templatePath = path.join(
      __dirname,
      '../email-templates/pages/email-confirmation/email-confirmation.html',
    );
    const cssPath = path.join(
      __dirname,
      '../email-templates/pages/email-confirmation/styles.css',
    );
    const outputPath = path.join(
      __dirname,
      '../email-templates/output/rendered-inline.html',
    );

    const htmlContent = fs.readFileSync(templatePath, 'utf8');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    const inlineHtml = juice.inlineContent(htmlContent, cssContent);

    fs.writeFileSync(outputPath, inlineHtml);
    console.log(`HTML renderizado com CSS inline salvo em: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao renderizar o HTML:', error);
  }
};

renderAndSaveHtml();
