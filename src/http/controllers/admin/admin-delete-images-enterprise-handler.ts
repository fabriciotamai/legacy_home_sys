import { makeDeleteEnterpriseImagesUseCase } from '@/use-cases/factories/admin/make-delete-images-enterprise-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const paramsSchema = z.object({
  enterpriseId: z.string().regex(/^\d+$/, 'O ID do empreendimento deve ser um número válido.').transform(Number),
});

const bodySchema = z.object({
  imageUrls: z.array(
    z.string().min(5, 'Caminho da imagem inválido.') 
  ).min(1, 'Deve haver pelo menos uma imagem para deletar.'),
});

export async function adminDeleteEnterpriseImagesHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    
    const { enterpriseId } = paramsSchema.parse(request.params);
    const { imageUrls } = bodySchema.parse(request.body);

    const deleteEnterpriseImagesUseCase = makeDeleteEnterpriseImagesUseCase();
    await deleteEnterpriseImagesUseCase.execute({ enterpriseId, imageUrls });

    reply.status(200).send({ message: 'Imagens deletadas com sucesso.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors });
    } else {
      console.error('Erro ao deletar imagens:', error);
      reply.status(500).send({ error: 'Erro interno do servidor.' });
    }
  }
}
