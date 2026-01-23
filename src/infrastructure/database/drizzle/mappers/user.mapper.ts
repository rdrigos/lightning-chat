import { UniqueEntityID } from '@/domain/entities/value-objects/unique-entity-id.vo';
import { DrizzleUser, DrizzleUserInsert } from '@/infrastructure/database/drizzle/schemas/user.schema';
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

  public static toDrizzle(user: User): DrizzleUserInsert {
    return {
      id: user.getId().toValue(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
