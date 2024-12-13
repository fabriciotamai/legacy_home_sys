

import { AdminRepository } from '@/repositories/admin-repository';
import { User } from '@prisma/client';

export class GetAllUsersUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(): Promise<User[]> {
    
    return this.adminRepository.findAllUsers();
  }
}
