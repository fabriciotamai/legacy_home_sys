var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { makeSendDocumentsUseCase } from '@/use-cases/factories/users/make-send-document-use-case';
import { saveFile } from '@/utils/save-file';
import { z } from 'zod';
export function sendDocumentsHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const sendDocumentsSchema = z.object({
            documentType: z.enum(['RG', 'CNH', 'PASSPORT']),
        });
        try {
            if (!request.user) {
                return reply.status(401).send({ error: 'Usuário não autenticado.' });
            }
            const parts = request.parts();
            const fields = {};
            let documentFront;
            let documentBack;
            let proofOfAddress;
            let incomeTaxProof;
            try {
                for (var _d = true, parts_1 = __asyncValues(parts), parts_1_1; parts_1_1 = yield parts_1.next(), _a = parts_1_1.done, !_a; _d = true) {
                    _c = parts_1_1.value;
                    _d = false;
                    const part = _c;
                    if (part.type === 'field') {
                        if (typeof part.value === 'string') {
                            fields[part.fieldname] = part.value;
                        }
                        else {
                            throw new Error(`O campo ${part.fieldname} não é do tipo string.`);
                        }
                    }
                    else if (part.fieldname === 'documentFront') {
                        documentFront = yield saveFile(part);
                    }
                    else if (part.fieldname === 'documentBack') {
                        documentBack = yield saveFile(part);
                    }
                    else if (part.fieldname === 'proofOfAddress') {
                        proofOfAddress = yield saveFile(part);
                    }
                    else if (part.fieldname === 'incomeTaxProof') {
                        incomeTaxProof = yield saveFile(part);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = parts_1.return)) yield _b.call(parts_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const parsedFields = sendDocumentsSchema.parse(fields);
            if (!documentFront) {
                return reply.status(400).send({ error: 'A imagem da frente do documento é obrigatória.' });
            }
            if (!proofOfAddress) {
                return reply.status(400).send({ error: 'O comprovante de endereço é obrigatório.' });
            }
            if (!incomeTaxProof) {
                return reply.status(400).send({ error: 'O comprovante de imposto de renda é obrigatório.' });
            }
            const userId = request.user.id;
            const sendDocumentsUseCase = makeSendDocumentsUseCase();
            yield sendDocumentsUseCase.execute({
                userId,
                documentType: parsedFields.documentType,
                documentFront,
                documentBack,
                proofOfAddress,
                incomeTaxProof,
            });
            reply.status(200).send({ message: 'Documentos enviados com sucesso.' });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ errors: error.errors });
            }
            console.error('Erro inesperado no handler:', error);
            reply.status(500).send({ error: 'Erro inesperado.' });
        }
    });
}
