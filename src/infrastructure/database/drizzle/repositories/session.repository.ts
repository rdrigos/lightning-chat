import { DRIZZLE, type DrizzleDB } from '@/infrastructure/database/drizzle/drizzle.provider';
import { sessionTable } from '@/infrastructure/database/drizzle/drizzle.schema';
import { DrizzleSessionMapper } from '@/infrastructure/database/drizzle/mappers/session.mapper';
import { Session } from '@/modules/auth/entities/session.entity';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleSessionRepository implements SessionRepository {
  constructor(
    @Inject(DRIZZLE)
    private drizzle: DrizzleDB
  ) {}

  public async save(session: Session): Promise<void> {
    const raw = DrizzleSessionMapper.toDrizzle(session);
    await this.drizzle.insert(sessionTable).values(raw).onConflictDoUpdate({ target: sessionTable.id, set: raw });
  }

  public async findByUserId(userId: string): Promise<Session[]> {
    const raw = await this.drizzle.select().from(sessionTable).where(eq(sessionTable.userId, userId));
    return raw.map(DrizzleSessionMapper.toDomain);
  }
}
