import { makeGetDashboardDataUseCase } from '@/use-cases/factories/users/make-get-dashboard-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getDashboardDataHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const userId = request.user?.id;

    if (!userId) {
      reply.status(401).send({
        error: 'Usuário não autenticado.',
      });
      return;
    }

    const getDashboardDataUseCase = makeGetDashboardDataUseCase();

    const dashboardData = await getDashboardDataUseCase.execute({ userId });

    reply.status(200).send({
      message: 'Dados do dashboard recuperados com sucesso.',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Erro ao recuperar dados do dashboard:', error);

    reply.status(500).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
