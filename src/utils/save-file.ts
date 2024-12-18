import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function saveFile(file: MultipartFile): Promise<string> {
  const uploadsDir = join(__dirname, '../../uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = join(uploadsDir, file.filename);
  const writeStream = createWriteStream(filePath);

  await file.toBuffer().then((buffer) => writeStream.write(buffer));
  writeStream.close();

  return filePath;
}

export { saveFile };
