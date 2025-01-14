import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

const uploadsDir = join(__dirname, '../../uploads');

async function saveFile(file: MultipartFile): Promise<{ absolutePath: string; relativePath: string; mimeType: string }> {
  await fs.mkdir(uploadsDir, { recursive: true });

  const sanitizedFileName = file.filename.replace(/\s+/g, '-');
  const absolutePath = join(uploadsDir, sanitizedFileName); // Caminho absoluto
  const relativePath = `/uploads/${sanitizedFileName}`; // Caminho relativo

  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(absolutePath);
    const fileStream = file.file;

    fileStream.pipe(writeStream);

    fileStream.on('end', () => {
      writeStream.close();
      resolve({
        absolutePath,
        relativePath,
        mimeType: file.mimetype, // Retorna o mimeType identificado pelo MultipartFile
      });
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

export { saveFile };
