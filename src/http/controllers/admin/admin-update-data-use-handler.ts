import { makeAdminUpdateUserUseCase } from '@/use-cases/factories/admin/make-update-data-user-use-case';
import { ComplianceStatus, DocumentType, Role } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminUpdateUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/, 'O ID do usuário deve ser um número válido.'),
  });

  const updateUserSchema = z.object({
    firstName: z.string().min(1, 'O primeiro nome é obrigatório.').optional(),
    lastName: z.string().min(1, 'O sobrenome é obrigatório.').optional(),
    email: z.string().email('E-mail inválido.').optional(),
    phone: z.string().optional(),
    userType: z.enum(['INDIVIDUAL', 'BUSINESS']).optional(),
    isActive: z.boolean().optional(),
    complianceStatus: z.nativeEnum(ComplianceStatus).optional(),
    role: z.nativeEnum(Role).optional(),
    documentType: z.nativeEnum(DocumentType).optional(),
    numberDocument: z.string().optional(),
  });

  try {
    if (!request.user || request.user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Acesso negado.' });
    }

    const { id } = paramsSchema.parse(request.params);

    const userData = updateUserSchema.parse(request.body);

    const updateUserUseCase = makeAdminUpdateUserUseCase();
    await updateUserUseCase.execute({ userId: Number(id), ...userData });

    reply.status(200).send({ message: 'Dados do usuário atualizados com sucesso!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    console.error('Erro inesperado ao atualizar usuário:', error);
    return reply.status(500).send({ error: 'Erro inesperado.' });
  }
}
