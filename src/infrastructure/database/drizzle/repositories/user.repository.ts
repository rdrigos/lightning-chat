import { DRIZZLE, type DrizzleDB } from '@/infrastructure/database/drizzle/drizzle.provider';
import { DrizzleUserMapper } from '@/infrastructure/database/drizzle/mappers/user.mapper';
import { userTable } from '@/infrastructure/database/drizzle/schemas';
import { User } from '@/modules/users/entities/user.entity';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(
    @Inject(DRIZZLE)
    private drizzle: DrizzleDB
  ) {}

  public async save(user: User): Promise<void> {
    const raw = DrizzleUserMapper.toDrizzle(user);
    await this.drizzle.insert(userTable).values(raw).onConflictDoUpdate({ target: userTable.id, set: raw });
  }

  public async findByEmail(email: string): Promise<User | null> {
    const [raw] = await this.drizzle.select().from(userTable).where(eq(userTable.email, email));
    return raw ? DrizzleUserMapper.toDomain(raw) : null;
  }
}
