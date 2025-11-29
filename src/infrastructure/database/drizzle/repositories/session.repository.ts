import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.vo';
import { DRIZZLE, type DrizzleDB } from '@/infrastructure/database/drizzle/drizzle.provider';
import { DrizzleSessionMapper } from '@/infrastructure/database/drizzle/mappers/session.mapper';
import { sessionTable } from '@/infrastructure/database/drizzle/schemas';
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
    const persistence = DrizzleSessionMapper.toDrizzle(session);
    await this.drizzle
      .insert(sessionTable)
      .values(persistence)
      .onConflictDoUpdate({ target: sessionTable.id, set: persistence });
  }

  public async findAllByUserId(userId: UniqueEntityID): Promise<Session[]> {
    const raw = await this.drizzle.select().from(sessionTable).where(eq(sessionTable.userId, userId.toValue()));
    return raw.map(DrizzleSessionMapper.toDomain);
  }
}
