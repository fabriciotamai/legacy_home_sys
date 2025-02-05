import { prisma } from '@/lib/prisma';
import { TokenRepository } from '@/repositories/token-repository';
import { Token, TokenHolder, TokenTransaction } from '@prisma/client';
import Decimal from 'decimal.js';

export class PrismaTokenRepository implements TokenRepository {
  async createToken(enterpriseId: number, name: string, totalSupply: number, price: Decimal): Promise<Token> {
    return prisma.token.create({
      data: {
        enterpriseId,
        name,
        totalSupply,
        price: price.toString(),
      },
    });
  }

  async findTokenByEnterprise(enterpriseId: number): Promise<Token | null> {
    return prisma.token.findUnique({
      where: { enterpriseId },
      include: { holders: true },
    });
  }

  async updateToken(id: number, data: { name?: string; totalSupply?: number; price?: Decimal }): Promise<Token> {
    const updateData: any = { ...data };
    if (data.price) {
      updateData.price = data.price.toString();
    }
    return prisma.token.update({
      where: { id },
      data: updateData,
    });
  }

  async createTokenHolder(
    tokenId: number,
    userId: number,
    initialBalance: Decimal = new Decimal(0)
  ): Promise<TokenHolder> {
    return prisma.tokenHolder.create({
      data: {
        tokenId,
        userId,
        balance: initialBalance.toString(),
      },
    });
  }

  async updateTokenHolder(tokenId: number, userId: number, balance: Decimal): Promise<TokenHolder> {
    return prisma.tokenHolder.update({
      where: { tokenId_userId: { tokenId, userId } },
      data: { balance: balance.toString() },
    });
  }

  async getTokenHolders(tokenId: number): Promise<TokenHolder[]> {
    return prisma.tokenHolder.findMany({
      where: { tokenId },
      include: { user: true },
    });
  }

  async getCirculation(tokenId: number): Promise<Decimal> {
    const result = await prisma.tokenHolder.aggregate({
      _sum: { balance: true },
      where: { tokenId },
    });

    return new Decimal(result._sum.balance || '0');
  }

  async createTokenTransaction(
    tokenId: number,
    userId: number,
    type: string,
    amount: Decimal,
    totalValue: Decimal
  ): Promise<TokenTransaction> {
    return prisma.tokenTransaction.create({
      data: {
        tokenId,
        userId,
        type: type as any,
        amount: amount.toString(),
        totalValue: totalValue.toString(),
      },
    });
  }

  async getTokenAvailablePercentage(tokenId: number): Promise<Decimal> {
    const token = await prisma.token.findUnique({
      where: { id: tokenId },
      select: { totalSupply: true },
    });
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const totalSupply = new Decimal(token.totalSupply);
    const circulation = await this.getCirculation(tokenId);

    const percentageSold = circulation.dividedBy(totalSupply).times(100);
    const percentageAvailable = new Decimal(100).minus(percentageSold);
    return percentageAvailable;
  }

  async getTokenHolderValueInUSD(tokenHolder: TokenHolder): Promise<Decimal> {
    const token = await prisma.token.findUnique({
      where: { id: tokenHolder.tokenId },
      select: { price: true },
    });
    if (!token) {
      throw new Error('Token não encontrado');
    }
    const balance = new Decimal(tokenHolder.balance);
    const price = new Decimal(token.price);
    return balance.times(price);
  }
}
