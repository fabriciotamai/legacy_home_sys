var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeAddAddressUseCase } from '@/use-cases/factories/users/make-address-use-case';
import { z } from 'zod';
export function addAddressHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield addAddressUseCase.execute(Object.assign({ userId }, addressData));
            reply.status(201).send({ message: 'Endereço cadastrado com sucesso.' });
        }
        catch (error) {
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
    });
}
