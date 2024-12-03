import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

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
