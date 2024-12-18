import { makeAddAddressUseCase } from '@/use-cases/factories/users/make-address-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function addAddressHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
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
    if (!request.user) {
      console.error('Erro: Usuário não autenticado.');
      return reply.status(401).send({ error: 'Usuário não autenticado.' });
    }

    const addressData = addAddressSchema.parse(request.body);
    const userId = request.user.id;

    const addAddressUseCase = makeAddAddressUseCase();

    await addAddressUseCase.execute({ userId, ...addressData });

    reply.status(201).send({ message: 'Endereço cadastrado com sucesso.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
      return reply.status(400).send({ errors: error.errors });
    }

    if (error instanceof Error) {
      console.error('Erro inesperado no handler:', error.message);
      return reply.status(500).send({ error: 'Erro inesperado.' });
    }

    return reply.status(500).send({ error: 'Erro desconhecido.' });
  }
}
