import { app } from './app';
import { env } from './env';

// Função para iniciar o servidor
const iniciarServidor = async () => {
  try {
    
    const port = env.PORT || 3000;

    
    await app.listen({ port, host: '0.0.0.0' });

    console.log(`Servidor rodando na porta ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1); 
  }
};

// Iniciar a função de servidor
void iniciarServidor();
