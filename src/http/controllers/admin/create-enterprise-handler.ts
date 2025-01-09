import { makeCreateEnterpriseUseCase } from '@/use-cases/factories/admin/make-create-enterprise-input-use-case';
import { saveFile } from '@/utils/save-file';
import { ConstructionType } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const createEnterpriseSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  corporateName: z.string().min(1, 'A razão social é obrigatória.'),
  address: z.string().min(1, 'O endereço é obrigatório.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  investmentType: z.enum(['MONEY', 'PROPERTY'], {
    errorMap: () => ({
      message: 'O tipo de investimento deve ser MONEY ou PROPERTY.',
    }),
  }),
  isAvailable: z.boolean(),
  constructionType: z.nativeEnum(ConstructionType, {
    errorMap: () => ({
      message: 'O tipo de construção é obrigatório e deve ser válido.',
    }),
  }),
  fundingAmount: z.number().positive('O valor de aporte deve ser maior que zero.'),
  transferAmount: z.number().positive('O valor repassado deve ser maior que zero.'),
  postalCode: z.string().min(1, 'O código postal é obrigatório.'),
  city: z.string().min(1, 'A cidade é obrigatória.'),
  squareMeterValue: z.number().positive('O valor por metro quadrado deve ser maior que zero.'),
  area: z.number().positive('A metragem total deve ser maior que zero.'),
  floors: z.number().int().positive().optional(),
  completionDate: z.coerce.date().optional().refine(
    (date) => !date || date > new Date(),
    'A data de conclusão deve ser no futuro.'
  ),
});

export async function createEnterpriseHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
   
    const parts = request.parts();
    const formData: Record<string, any> = {};
    const imageUrls: string[] = [];
    let coverImageUrl: string | undefined;

    let isFirstImage = true;
    for await (const part of parts) {
      if (part.type === 'file') {
        const filePath = await saveFile(part);
        if (isFirstImage) {
          coverImageUrl = filePath;
          isFirstImage = false;
        } else {
          imageUrls.push(filePath);
        }
      } else {
        formData[part.fieldname] = part.value;
      }
    }

  
    const parsedData = {
      ...formData,
      isAvailable: formData.isAvailable === 'true' || formData.isAvailable === true, 
      fundingAmount: parseFloat(formData.fundingAmount),
      transferAmount: parseFloat(formData.transferAmount),
      squareMeterValue: parseFloat(formData.squareMeterValue),
      area: parseFloat(formData.area),
      floors: formData.floors ? parseInt(formData.floors, 10) : undefined,
      completionDate: formData.completionDate ? new Date(formData.completionDate) : undefined,
    };

    
    const validatedBody = createEnterpriseSchema.parse(parsedData);

    console.info('Criando empreendimento com os dados fornecidos.');

    const createEnterpriseUseCase = makeCreateEnterpriseUseCase();

    const enterprise = await createEnterpriseUseCase.execute({
      ...validatedBody,
      coverImageUrl,
      imageUrls,
    });

    reply.status(201).send({
      message: 'Empreendimento criado com sucesso.',
      enterprise,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Erro de validação:', error.errors);

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

