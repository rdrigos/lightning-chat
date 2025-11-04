import { Hasher } from '@/core/cryptography/hasher.abstract';
import { CreateUserDTO } from '@/modules/users/dtos/create-user.dto';
import { UserDTO } from '@/modules/users/dtos/user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UserAlreadyExistsError } from '@/modules/users/errors/user-already-exists.error';
import { UserMapper } from '@/modules/users/mapper/user.mapper';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private hasher: Hasher,
    private userRepository: UserRepository
  ) {}

  public async execute(dto: CreateUserDTO): Promise<UserDTO> {
    const hasUserWithSameEmail = await this.userRepository.findByEmail(dto.email);

    if (hasUserWithSameEmail) {
      throw new UserAlreadyExistsError(dto.email);
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
