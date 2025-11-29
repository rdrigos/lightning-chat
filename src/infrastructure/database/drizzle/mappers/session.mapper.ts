import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.vo';
import { DrizzleSession, DrizzleSessionInsert } from '@/infrastructure/database/drizzle/schemas/session.schema';
import { Session } from '@/modules/auth/entities/session.entity';

export class DrizzleSessionMapper {
  public static toDomain(raw: DrizzleSession): Session {
    return Session.create(
      {
        userId: new UniqueEntityID(raw.userId),
        token: raw.token,
        expiresAt: raw.expiresAt,
        ipAddress: raw.ipAddress ?? undefined,
        userAgent: raw.userAgent ?? undefined,
      },
      {
        id: new UniqueEntityID(raw.id),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }
    );
  }

  public static toDrizzle(session: Session): DrizzleSessionInsert {
    return {
      id: session.getId().toValue(),
      userId: session.getUserId().toValue(),
      token: session.getToken(),
      expiresAt: session.getExpiresAt(),
      ipAddress: session.getIpAddress(),
      userAgent: session.getUserAgent(),
      createdAt: session.getCreatedAt(),
      updatedAt: session.getUpdatedAt(),
    };
  }
}
