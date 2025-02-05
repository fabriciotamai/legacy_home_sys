// src/repositories/token-repository.ts

import { Token, TokenHolder, TokenTransaction } from '@prisma/client';
import Decimal from 'decimal.js';

export interface TokenRepository {
  /**
   * Cria um token para uma enterprise com totalSupply e preço unitário.
   * @param enterpriseId - Identificador da enterprise.
   * @param name - Nome do token.
   * @param totalSupply - Quantidade total de tokens.
   * @param price - Preço unitário do token (usando Decimal para precisão).
   */
  createToken(enterpriseId: number, name: string, totalSupply: number, price: Decimal): Promise<Token>;

  /**
   * Retorna o token associado à enterprise, incluindo os holders (titulares).
   * @param enterpriseId - Identificador da enterprise.
   */
  findTokenByEnterprise(enterpriseId: number): Promise<Token | null>;

  /**
   * Atualiza os dados de um token (nome, totalSupply e/ou preço).
   * @param id - Identificador do token.
   * @param data - Dados para atualização. O preço, se fornecido, é um Decimal.
   */
  updateToken(id: number, data: { name?: string; totalSupply?: number; price?: Decimal }): Promise<Token>;

  /**
   * Cria um registro para um usuário que detém tokens (inicialmente com um balance opcional).
   * @param tokenId - Identificador do token.
   * @param userId - Identificador do usuário.
   * @param initialBalance - Saldo inicial (opcional), como Decimal.
   */
  createTokenHolder(tokenId: number, userId: number, initialBalance?: Decimal): Promise<TokenHolder>;

  /**
   * Atualiza o saldo (balance) do TokenHolder (usuário) para um token específico.
   * @param tokenId - Identificador do token.
   * @param userId - Identificador do usuário.
   * @param balance - Novo saldo, como Decimal.
   */
  updateTokenHolder(tokenId: number, userId: number, balance: Decimal): Promise<TokenHolder>;

  /**
   * Retorna a lista de holders (usuários) para um token, incluindo os dados do usuário.
   * @param tokenId - Identificador do token.
   */
  getTokenHolders(tokenId: number): Promise<TokenHolder[]>;

  /**
   * Calcula a soma dos balances de todos os holders para um token (quantidade em circulação).
   * Retorna um Decimal representando a soma.
   * @param tokenId - Identificador do token.
   */
  getCirculation(tokenId: number): Promise<Decimal>;

  /**
   * Cria uma transação de token (compra, venda ou transferência).
   * @param tokenId - Identificador do token.
   * @param userId - Identificador do usuário que realiza a transação.
   * @param type - Tipo de transação (compra, venda, transferência).
   * @param amount - Quantidade de tokens transacionada, como Decimal.
   * @param totalValue - Valor total da transação, como Decimal.
   */
  createTokenTransaction(
    tokenId: number,
    userId: number,
    type: string, // Idealmente, utilizar o enum TokenTransactionType
    amount: Decimal,
    totalValue: Decimal
  ): Promise<TokenTransaction>;

  /**
   * Calcula a porcentagem de tokens disponíveis para venda.
   * Exemplo: Se o totalSupply for 10.000 e a soma dos tokens vendidos for 9.000,
   * então 10% dos tokens estão disponíveis.
   * Retorna um Decimal representando a porcentagem disponível.
   * @param tokenId - Identificador do token.
   */
  getTokenAvailablePercentage(tokenId: number): Promise<Decimal>;

  /**
   * Obtém o valor em dólar de um TokenHolder, multiplicando o saldo do token pelo preço atual.
   * Retorna um Decimal com o valor calculado.
   * @param tokenHolder - Registro do TokenHolder.
   */
  getTokenHolderValueInUSD(tokenHolder: TokenHolder): Promise<Decimal>;
}
