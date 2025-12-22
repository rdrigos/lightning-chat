import { UserDTO } from '@/modules/users/dtos/user.dto';
import { User } from '@/modules/users/entities/user.entity';

export class UserMapper {
  public static toDTO(entity: User): UserDTO {
    return {
      id: entity.getId(),
      name: entity.getName(),
      email: entity.getEmail(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
