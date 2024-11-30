import { makeAdminRegisterUsers } from '@/use-cases/factories/admin/make-admin-register-users';
import { Role } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function adminRegisterUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  
  const adminRegisterUsersSchema = z.object({
    email: z.string().email('E-mail inválido.'), 
    username: z.string().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres.'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    numberDocument: z.string().optional(), 
    phone: z.string().optional(), 
    role: z.nativeEnum(Role, { errorMap: () => ({ message: 'O campo role é inválido.' }) }),
  });

  try {
    
    const validatedData = adminRegisterUsersSchema.parse(request.body);

    
    const adminRegisterUsersUseCase = makeAdminRegisterUsers();

    
    await adminRegisterUsersUseCase.execute(validatedData);

    
    reply.status(201).send({ message: 'Admin registrado com sucesso!' });
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      reply.status(400).send({ errors: error.errors }); 
    } else if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Erro interno do servidor.' });
    }
  }
}
