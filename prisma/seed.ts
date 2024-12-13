import { prisma } from '../src/lib/prisma';

export const seedPhasesIfNeeded = async () => {
  console.log('Verificando necessidade de seed de fases...');

  const existingPhase = await prisma.phase.findFirst();

  if (!existingPhase) {
    const startDate = new Date();
    const endDate = new Date(new Date().setFullYear(startDate.getFullYear() + 1));

    const phases = [
      {
        phaseName: 'Etapa 1',
        description: 'Preparação inicial.',
        order: 1,
        progress: 0.0, 
        tasks: [
          { taskName: 'Topografia', description: 'Preparação do terreno.' },
          { taskName: 'Hidráulica subterrânea', description: 'Instalações iniciais.' },
          { taskName: 'Escavação', description: 'Escavação do terreno.' },
          { taskName: 'Concretagem', description: 'Preparação das fundações.' },
        ],
      },
      {
        phaseName: 'Etapa 2',
        description: 'Construção básica.',
        order: 2,
        progress: 0.0,
        tasks: [
          { taskName: 'Alvenaria', description: 'Construção das paredes.' },
          { taskName: 'Estruturação', description: 'Reforço estrutural.' },
          { taskName: 'Impermeabilização do telhado', description: 'Proteção contra infiltrações.' },
        ],
      },
      {
        phaseName: 'Etapa 3',
        description: 'Instalações e inspeções.',
        order: 3,
        progress: 0.0,
        tasks: [
          { taskName: 'Inspeções', description: 'Inspeções iniciais da obra.' },
          { taskName: 'Instalações hidráulicas', description: 'Sistema de água e esgoto.' },
          { taskName: 'Instalações elétricas', description: 'Fiação elétrica.' },
          { taskName: 'Instalação de janelas e telhas', description: 'Fechamento da estrutura.' },
        ],
      },
      {
        phaseName: 'Etapa 4',
        description: 'Acabamento interno.',
        order: 4,
        progress: 0.0,
        tasks: [
          { taskName: 'Isolamento térmico das paredes', description: 'Proteção contra variação térmica.' },
          { taskName: 'Drywall', description: 'Montagem de divisórias internas.' },
          { taskName: 'Pinturas internas', description: 'Acabamento visual.' },
          { taskName: 'Rebocos', description: 'Correção de superfícies.' },
          { taskName: 'Portas internas', description: 'Instalação das portas.' },
        ],
      },
      {
        phaseName: 'Etapa 5',
        description: 'Acabamento externo.',
        order: 5,
        progress: 0.0,
        tasks: [
          { taskName: 'Isolamento térmico do telhado', description: 'Proteção do telhado.' },
          { taskName: 'Pisos', description: 'Instalação de pisos.' },
          { taskName: 'Acabamento hidráulico', description: 'Finalização do sistema de água.' },
          { taskName: 'Acabamento elétrico', description: 'Instalação de tomadas e luminárias.' },
          { taskName: 'Ar-condicionado', description: 'Instalação do sistema de climatização.' },
        ],
      },
      {
        phaseName: 'Etapa 6',
        description: 'Finalização e entrega.',
        order: 6,
        progress: 0.0,
        tasks: [
          { taskName: 'Portas', description: 'Instalação das portas externas.' },
          { taskName: 'Prateleiras', description: 'Instalação de prateleiras.' },
          { taskName: 'Acessórios', description: 'Colocação de acessórios finais.' },
          { taskName: 'Pintura final', description: 'Toques finais na pintura.' },
          { taskName: 'Grama', description: 'Plantação de grama no jardim.' },
          { taskName: 'Inspeção final', description: 'Inspeção final antes da entrega.' },
        ],
      },
    ];

    for (const phase of phases) {
      await prisma.phase.create({
        data: {
          phaseName: phase.phaseName,
          description: phase.description,
          order: phase.order,
          progress: phase.progress, 
          startDate,
          endDate,
          tasks: {
            create: phase.tasks.map((task) => ({
              taskName: task.taskName,
              description: task.description,
              isCompleted: false, 
            })),
          },
        },
      });
      console.log(`Fase "${phase.phaseName}" criada com progresso inicial ${phase.progress}%.`);
    }

    console.log('Seed concluído com sucesso.');
  } else {
    console.log('Fases já existentes no banco de dados. Seed não necessário.');
  }
};
