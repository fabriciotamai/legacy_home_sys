import { makeAddAddressUseCase } from '@/use-cases/factories/users/make-address-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminAddAddressHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/, 'O ID do usuário deve ser um número válido.'),
  });

  const addAddressSchema = z.object({
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

    // Validar o parâmetro da rota
    const { id } = paramsSchema.parse(request.params);

    // Validar o corpo da requisição
    const addressData = addAddressSchema.parse(request.body);

    // Use o caso de uso para adicionar o endereço
    const addAddressUseCase = makeAddAddressUseCase();
    await addAddressUseCase.execute({ userId: Number(id), ...addressData });

    reply.status(201).send({ message: 'Endereço cadastrado com sucesso.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ errors: error.errors });
    }

    return reply.status(500).send({ error: 'Erro inesperado.' });
  }
}
