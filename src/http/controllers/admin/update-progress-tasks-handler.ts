import { makeUpdateProgressUseCase } from '@/use-cases/factories/admin/make-update-progress-task-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const updateTaskStatusSchema = z.object({
  enterpriseId: z.number(),
  phaseId: z.number(),
  taskId: z.number(),
  isCompleted: z.boolean(),
});

export async function updateTaskStatusHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { enterpriseId, phaseId, taskId, isCompleted } = updateTaskStatusSchema.parse(request.body);

    const updateProgressUseCase = makeUpdateProgressUseCase();

    await updateProgressUseCase.execute({
      enterpriseId,
      phaseId,
      taskId,
      isCompleted,
    });

    reply.status(200).send({
      message: 'Status da tarefa e progresso atualizados com sucesso.',
    });
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
