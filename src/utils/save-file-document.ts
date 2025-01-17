import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

const uploadsDir = join(process.cwd(), 'uploads'); 

async function saveFileDocument(file: MultipartFile): Promise<{ absolutePath: string; relativePath: string; mimeType: string }> {
  await fs.mkdir(uploadsDir, { recursive: true });

  const sanitizedFileName = file.filename.replace(/\s+/g, '-');
  const absolutePath = join(uploadsDir, sanitizedFileName); 
  const relativePath = `uploads/${sanitizedFileName}`; 

  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(absolutePath);
    const fileStream = file.file;

    fileStream.pipe(writeStream);

    fileStream.on('end', () => {
      writeStream.close();
      resolve({
        absolutePath,
        relativePath,
        mimeType: file.mimetype, 
      });
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

export { saveFileDocument };
