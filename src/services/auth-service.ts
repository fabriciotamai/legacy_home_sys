import { prisma } from '@/lib/prisma';
import { generateToken, verifyToken } from '@/utils/jwt';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';


export async function loginUser(email: string, password: string): Promise<string> {
  
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Credenciais inválidas.');
  }

  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas.');
  }

  
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { tokenVersion: user.tokenVersion + 1 },
  });

  
  return generateToken(
    { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
    updatedUser.tokenVersion,
  );
}


export async function validateToken(token: string): Promise<JwtPayload> {
  const payload = verifyToken(token);

  if (!payload) {
    throw new Error('Token inválido ou expirado.');
  }

  
  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  
  if (user.tokenVersion !== payload.tokenVersion) {
    throw new Error('Token inválido ou expirado.');
  }

  return payload;
}


export async function registerUser(email: string, username: string, password: string, role: string) {
  
  if (!Object.values(Role).includes(role as Role)) {
    throw new Error('O valor de role é inválido.');
  }

  
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new Error('Email já está em uso.');
  }

  
  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    throw new Error('Nome de usuário já está em uso.');
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);

  
  return await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      role: role as Role, 
      tokenVersion: 0, 
    },
  });
}
