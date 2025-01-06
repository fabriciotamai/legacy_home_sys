import { makeAdminUpdateAddressUseCase } from '@/use-cases/factories/admin/make-admin-update-address-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminUpdateAddressHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/, 'O ID do usuário deve ser um número válido.'),
  });

  const updateAddressSchema = z.object({
    street: z.string().min(1, 'A rua é obrigatória.'),
    number: z.string().min(1, 'O número é obrigatório.'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'O bairro é obrigatório.'),
    city: z.string().min(1, 'A cidade é obrigatória.'),
    state: z.string().min(1, 'O estado é obrigatório.'),
    postalCode: z.string().min(1, 'O CEP é obrigatório.'),
    country: z.string().min(1, 'O país é obrigatório.'),
  });

  try {
    if (!request.user || request.user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Acesso negado.' });
    }

    const { id } = paramsSchema.parse(request.params);
    const addressData = updateAddressSchema.parse(request.body);
    const updateAddressUseCase = makeAdminUpdateAddressUseCase();
    await updateAddressUseCase.execute({ userId: Number(id), ...addressData });

    reply.status(200).send({ message: 'Endereço atualizado com sucesso.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    console.error('Erro inesperado ao atualizar endereço:', error);
    return reply.status(500).send({ error: 'Erro inesperado.' });
  }
}
