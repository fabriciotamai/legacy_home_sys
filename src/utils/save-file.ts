import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

const uploadsDir = join(__dirname, '../../uploads');

async function saveFile(file: MultipartFile): Promise<string> {
  await fs.mkdir(uploadsDir, { recursive: true });

  const sanitizedFileName = file.filename.replace(/\s+/g, '-'); 
  const filePath = join(uploadsDir, sanitizedFileName);

  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(filePath);
    const fileStream = file.file;

    fileStream.pipe(writeStream);

    fileStream.on('end', () => {
      writeStream.close();
      resolve(`/uploads/${sanitizedFileName}`); 
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

export { saveFile };
