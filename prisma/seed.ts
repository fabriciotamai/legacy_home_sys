import { prisma } from '../src/lib/prisma';

export async function main() {
  console.log('Verificando existência do usuário admin default...');

  const existingUser = await prisma.user.findUnique({
    where: { email: 'legacyhome@gmail.com' },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: 'legacyhome@gmail.com',
        username: 'legacyhome',
        password: 'legacyhome@2025', // Em produção, lembre-se de utilizar hash para a senha!
        firstName: 'Legacy',
        lastName: 'Home',
        userType: 'INDIVIDUAL', // ou BUSINESS, conforme sua necessidade
        role: 'ADMIN',
        // Os demais campos serão preenchidos com os valores padrão definidos no schema.
      },
    });
    console.log('Usuário admin default criado com sucesso.');
  } else {
    console.log('Usuário admin default já existe.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
