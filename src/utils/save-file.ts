import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Simula __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function saveFile(file: MultipartFile): Promise<string> {
  // Define o diretório de uploads
  const uploadsDir = join(__dirname, '../../uploads');
  await fs.mkdir(uploadsDir, { recursive: true }); // Cria o diretório se não existir

  // Caminho do arquivo a ser salvo
  const filePath = join(uploadsDir, file.filename);
  const writeStream = createWriteStream(filePath);

  // Salva o arquivo no servidor
  await file.toBuffer().then((buffer) => writeStream.write(buffer));
  writeStream.close();

  return filePath; // Retorna o caminho do arquivo salvo
}

export { saveFile };
