import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { Readable } from 'stream';

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  console.log('🔄 Iniciando consumo do stream...');
  
  const chunks: Uint8Array[] = [];
  try {
    for await (const chunk of stream) {
      console.log(`📦 Chunk recebido (${chunk.length} bytes)...`);
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    console.log(`✅ Stream consumido com sucesso (${buffer.length} bytes).`);
    return buffer;
  } catch (error) {
    console.error('❌ Erro ao consumir stream:', error);
    throw error;
  }
}

export async function extractTextFromFile(fileBuffer: Buffer, mimeType: string, timeout: number = 600000): Promise<string> {
  try {
    console.log(`📥 Iniciando extração de texto (Tipo: ${mimeType}, Tamanho: ${fileBuffer.length} bytes)`);

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
      console.error('❌ Formato de arquivo inválido.');
      throw new Error('Formato de arquivo inválido. Apenas arquivos PDF e DOCX são suportados.');
    }

    if (mimeType === 'application/pdf') {
      console.log('🔍 Processando arquivo PDF...');
      const pdfData = await pdfParse(fileBuffer);
      console.log('✅ PDF processado com sucesso!');
      return pdfData.text.trim() || 'Erro: Nenhum texto extraído do PDF.';
    }

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('🔍 Processando arquivo DOCX...');
      
      const result = await Promise.race([
        mammoth.extractRawText({ buffer: fileBuffer }),
        new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Timeout ao processar DOCX')), timeout)),
      ]).catch((error) => {
        throw new Error(`Erro no processamento do arquivo DOCX: ${error.message}`);
      });

      console.log('✅ DOCX processado com sucesso!');
      return (result as any).value.trim() || 'Erro: Nenhum texto extraído do DOCX.';
    }

    // Adicione um retorno explícito fora das condições, embora ele nunca seja atingido.
    throw new Error('Caminho não alcançável');
  } catch (error) {
    console.error('❌ Erro ao extrair texto do arquivo:', error);
    throw new Error('Falha ao extrair texto do documento. Verifique se o arquivo contém texto legível.');
  }
}

