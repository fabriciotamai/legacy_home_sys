import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

const uploadsDir = join(__dirname, '../../uploads');

async function saveFile(file: MultipartFile): Promise<string> {
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = join(uploadsDir, file.filename);

  // Certifica-se de que os dados estão sendo escritos corretamente
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(filePath);
    const fileStream = file.file; // Corrige o fluxo de leitura do arquivo

    fileStream.pipe(writeStream);

    fileStream.on('end', () => {
      writeStream.close();
      resolve(filePath);
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

export { saveFile };
