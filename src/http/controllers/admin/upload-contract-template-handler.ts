import { makeUploadContractTemplateUseCase } from '@/use-cases/factories/admin/make-upload-contract-template-use-case';
import { saveFile } from '@/utils/save-file';
import { ContractTemplateType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function uploadContractTemplateHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    console.log('🟢 Recebendo requisição de upload...');

    if (!request.isMultipart()) {
      reply.status(400).send({ error: 'Requisição inválida. Deve ser multipart/form-data.' });
      return;
    }

    const parts = request.parts();
    let filePath: string | undefined;
    let filename: string | undefined;
    let mimeType: string | undefined;
    let templateType: string | undefined;

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'file') {
        const savedFile = await saveFile(part);
        filePath = savedFile.relativePath; // 🔹 Agora salva apenas o caminho relativo
        filename = part.filename;
        mimeType = savedFile.mimeType;
        console.log('📂 Arquivo salvo em:', filePath);
      }

      if (part.type === 'field' && part.fieldname === 'templateType') {
        templateType = part.value;
        console.log('📄 Template Type:', templateType);
      }
    }

    if (!filePath || !filename || !mimeType) {
      reply.status(400).send({ error: 'Arquivo não encontrado ou não foi salvo.' });
      return;
    }

    if (!templateType || !(templateType in ContractTemplateType)) {
      reply.status(400).send({ error: 'Template type inválido.' });
      return;
    }

    console.log('📥 Enviando dados para o UseCase...');
    const uploadContractTemplateUseCase = makeUploadContractTemplateUseCase();
    const adminId = request.user?.id;

    if (!adminId) {
      reply.status(401).send({ error: 'Usuário não autenticado.' });
      return;
    }

    const result = await uploadContractTemplateUseCase.execute({
      templateType: templateType as ContractTemplateType,
      filePath, // 🔹 Passamos apenas o caminho do arquivo
      fileMimeType: mimeType,
      adminId,
    });

    console.log('✅ Template salvo no banco:', result);

    reply.status(200).send({
      message: 'Arquivo salvo com sucesso!',
      templateId: result.id,
    });
  } catch (error: any) {
    console.error('❌ Erro durante o upload:', error);
    reply.status(500).send({ error: 'Erro interno', details: error.message });
  }
}
