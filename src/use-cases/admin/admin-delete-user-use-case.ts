import { AdminRepository } from '@/repositories/admin-repository';

export class DeleteUserUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(userId: number): Promise<void> {
    const user = await this.adminRepository.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    await this.adminRepository.deleteUser(userId);
  }
}
