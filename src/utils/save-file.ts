import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

const uploadsDir = join(__dirname, '../../uploads');

async function saveFile(file: MultipartFile): Promise<string> {
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = join(uploadsDir, file.filename);

  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(filePath);
    const fileStream = file.file;

    fileStream.pipe(writeStream);

    fileStream.on('end', () => {
      writeStream.close();
      resolve(`/uploads/${file.filename}`);
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

export { saveFile };
