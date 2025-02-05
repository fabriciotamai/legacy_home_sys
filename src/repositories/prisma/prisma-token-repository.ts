import { prisma } from '@/lib/prisma';
import { TokenRepository } from '@/repositories/token-repository';
import { Token, TokenHolder, TokenTransaction } from '@prisma/client';

export class PrismaTokenRepository implements TokenRepository {
  // Cria um token para uma enterprise com totalSupply e preço unitário
  async createToken(enterpriseId: number, name: string, totalSupply: number, price: number): Promise<Token> {
    return prisma.token.create({
      data: {
        enterpriseId,
        name,
        totalSupply,
        price, // Caso o campo seja do tipo Decimal, verifique se a conversão é necessária
      },
    });
  }

  // Retorna o token associado à enterprise, incluindo os titulares (holders)
  async findTokenByEnterprise(enterpriseId: number): Promise<Token | null> {
    return prisma.token.findUnique({
      where: { enterpriseId },
      include: { holders: true },
    });
  }

  // Atualiza os dados de um token (nome, totalSupply e/ou preço)
  async updateToken(id: number, data: { name?: string; totalSupply?: number; price?: number }): Promise<Token> {
    return prisma.token.update({
      where: { id },
      data,
    });
  }

  // Cria um registro para um usuário que detém tokens (inicialmente com um balance opcional)
  async createTokenHolder(tokenId: number, userId: number, initialBalance: number = 0): Promise<TokenHolder> {
    return prisma.tokenHolder.create({
      data: {
        tokenId,
        userId,
        balance: initialBalance,
      },
    });
  }

  // Atualiza o saldo (balance) do TokenHolder (usuário) para um token específico
  async updateTokenHolder(tokenId: number, userId: number, balance: number): Promise<TokenHolder> {
    return prisma.tokenHolder.update({
      // É necessário referenciar a chave única composta definida no modelo
      where: { tokenId_userId: { tokenId, userId } },
      data: { balance },
    });
  }

  // Retorna a lista de holders (usuários) para um token, incluindo os dados do usuário
  async getTokenHolders(tokenId: number): Promise<TokenHolder[]> {
    return prisma.tokenHolder.findMany({
      where: { tokenId },
      include: { user: true },
    });
  }

  // Calcula a soma dos balances de todos os holders para um token (quantidade em circulação)
  async getCirculation(tokenId: number): Promise<number> {
    const result = await prisma.tokenHolder.aggregate({
      _sum: { balance: true },
      where: { tokenId },
    });
    return result._sum.balance || 0;
  }

  // Cria uma transação de token (compra, venda ou transferência)
  async createTokenTransaction(
    tokenId: number,
    userId: number,
    type: string, // Idealmente, este parâmetro seria do tipo TokenTransactionType (enum)
    amount: number,
    totalValue: number
  ): Promise<TokenTransaction> {
    return prisma.tokenTransaction.create({
      data: {
        tokenId,
        userId,
        type: type as any, // se o campo for do tipo enum, certifique-se de passar o valor correto
        amount,
        totalValue,
      },
    });
  }
}
