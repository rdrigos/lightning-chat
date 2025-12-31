import { Hasher } from '@/core/cryptography/hasher.abstract';
import { TokenProvider } from '@/core/cryptography/token-provider.abstract';
import { SignInRequest } from '@/modules/auth/dtos/sign-in-request.dto';
import { SignInResponse } from '@/modules/auth/dtos/sign-in-response.dto';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/invalid-credentials.exception';
import { UserMapper } from '@/modules/users/mappers/user.mapper';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignInUseCase {
  constructor(
    private hasher: Hasher,
    private tokenProvider: TokenProvider,
    private userRepository: UserRepository
  ) {}

  public async execute(dto: SignInRequest): Promise<SignInResponse> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.hasher.compare(dto.password, user.getPassword());

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = await this.tokenProvider.sign(user.getId());

    return {
      accessToken,
      user: UserMapper.toDTO(user),
    };
  }
}
