import { UniqueEntityID } from '@/domain/entities/value-objects/unique-entity-id.vo';
import { DrizzleUser, DrizzleUserInsert } from '@/infrastructure/database/drizzle/drizzle.schema';
import { User } from '@/modules/users/entities/user.entity';

export class DrizzleUserMapper {
  public static toDomain(raw: DrizzleUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      {
        id: new UniqueEntityID(raw.id),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }
    );
  }

  public static toDrizzle(entity: User): DrizzleUserInsert {
    return {
      id: entity.getId().toValue(),
      name: entity.getName(),
      email: entity.getEmail(),
      password: entity.getPassword(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
