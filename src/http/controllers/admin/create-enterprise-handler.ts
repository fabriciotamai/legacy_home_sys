import { makeCreateEnterpriseUseCase } from '@/use-cases/factories/admin/make-create-enterprise-input-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const createEnterpriseSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  investmentType: z.enum(['MONEY', 'PROPERTY'], {
    errorMap: () => ({ message: 'O tipo de investimento deve ser MONEY ou PROPERTY.' }),
  }),
  isAvailable: z.boolean(),
  currentPhaseId: z.number().int().positive().optional(), 
  currentTaskId: z.number().int().positive().optional(),  
  constructionType: z.string().min(1, 'O tipo de construção é obrigatório.'),
  fundingAmount: z.number().positive('O valor de aporte deve ser maior que zero.'),
  transferAmount: z.number().positive('O valor repassado deve ser maior que zero.'),
  postalCode: z.string().min(1, 'O código postal é obrigatório.'),
  city: z.string().min(1, 'A cidade é obrigatória.'),
  squareMeterValue: z.number().positive('O valor por metro quadrado deve ser maior que zero.'),
  area: z.number().positive('A metragem total deve ser maior que zero.'),
  floors: z.number().int().positive().optional(), 
  completionDate: z.coerce.date().optional(), 
});

export async function createEnterpriseHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    
    const validatedBody = createEnterpriseSchema.parse(request.body);

    
    console.log('Dados validados:', validatedBody);

    
    const createEnterpriseUseCase = makeCreateEnterpriseUseCase();

    
    const enterprise = await createEnterpriseUseCase.execute(validatedBody);

    
    reply.status(201).send({
      message: 'Empreendimento criado com sucesso.',
      enterprise, 
    });
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);

      reply.status(422).send({
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    
    console.error('Erro ao criar empreendimento:', error);

    reply.status(400).send({
      error: error instanceof Error ? error.message : 'Erro inesperado.',
    });
  }
}
