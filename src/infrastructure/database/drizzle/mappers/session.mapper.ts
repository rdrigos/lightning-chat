import { UniqueEntityID } from '@/domain/entities/value-objects/unique-entity-id.vo';
import { DrizzleSession, DrizzleSessionInsert } from '@/infrastructure/database/drizzle/drizzle.schema';
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

  public static toDrizzle(entity: Session): DrizzleSessionInsert {
    return {
      id: entity.getId().toValue(),
      userId: entity.getUserId().toValue(),
      token: entity.getToken(),
      expiresAt: entity.getExpiresAt(),
      ipAddress: entity.getIpAddress(),
      userAgent: entity.getUserAgent(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
