import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

const uploadsDir = join(__dirname, '../../uploads');

async function saveFile(file: MultipartFile): Promise<string> {
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = join(uploadsDir, file.filename);
  const writeStream = createWriteStream(filePath);

  await file.toBuffer().then((buffer) => writeStream.write(buffer));
  writeStream.close();

  return filePath;
}

export { saveFile };
