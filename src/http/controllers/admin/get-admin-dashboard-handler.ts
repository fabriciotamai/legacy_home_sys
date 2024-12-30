import { makeGetAdminDashboardDataUseCase } from '@/use-cases/factories/admin/make-get-admin-dashboard-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getAdminDashboardHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const getAdminDashboardDataUseCase = makeGetAdminDashboardDataUseCase();

    const dashboardData = await getAdminDashboardDataUseCase.execute();

    reply.status(200).send({
      message: 'Dados do dashboard do admin recuperados com sucesso.',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard do admin:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
