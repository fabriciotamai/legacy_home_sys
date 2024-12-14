var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeUpdateProgressUseCase } from "@/use-cases/factories/admin/make-update-progress-task-use-case";
import { z } from "zod";
const updateTaskStatusSchema = z.object({
    enterpriseId: z.number(),
    phaseId: z.number(),
    taskId: z.number(),
    isCompleted: z.boolean(),
});
export function updateTaskStatusHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { enterpriseId, phaseId, taskId, isCompleted } = updateTaskStatusSchema.parse(request.body);
            const updateProgressUseCase = makeUpdateProgressUseCase();
            yield updateProgressUseCase.execute({
                enterpriseId,
                phaseId,
                taskId,
                isCompleted,
            });
            reply.status(200).send({
                message: "Status da tarefa e progresso atualizados com sucesso.",
            });
        }
        catch (error) {
            console.error("Erro ao atualizar status da tarefa:", error);
            reply.status(400).send({
                error: error instanceof Error ? error.message : "Erro inesperado.",
            });
        }
    });
}
