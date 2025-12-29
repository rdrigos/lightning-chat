import { Hasher } from '@/core/cryptography/hasher.abstract';
import { CreateUserRequestDTO } from '@/modules/users/dtos/create-user-request.dto';
import { UserDTO } from '@/modules/users/dtos/user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UserAlreadyExistsException } from '@/modules/users/exceptions/user-already-exists.exception';
import { UserMapper } from '@/modules/users/mappers/user.mapper';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private hasher: Hasher,
    private userRepository: UserRepository
  ) {}

  public async execute(dto: CreateUserRequestDTO): Promise<UserDTO> {
    const hasUserWithSameEmail = await this.userRepository.findByEmail(dto.email);

    if (hasUserWithSameEmail) {
      throw new UserAlreadyExistsException(dto.email);
    }

    const hashedPassword = await this.hasher.hash(dto.password);

    const user = User.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return UserMapper.toDTO(user);
  }
}
