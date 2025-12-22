import { User } from '@/modules/users/entities/user.entity';
import { UserRepository } from '@/modules/users/repositories/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  public reset(): void {
    this.users = [];
  }

  public async save(user: User): Promise<void> {
    const index = this.users.findIndex((stored) => stored.getId() === user.getId());
    index >= 0 ? (this.users[index] = user) : this.users.push(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.getEmail() === email);
    if (!user) return null;
    return user;
  }
}
