import { Hasher } from '@/domain/cryptography/hasher.abstract';
import { TokenProvider } from '@/domain/cryptography/token-provider.abstract';
import { RequestContextDTO } from '@/modules/auth/dtos/request-context.dto';
import { SignInRequestDTO } from '@/modules/auth/dtos/sign-in-request.dto';
import { Session } from '@/modules/auth/entities/session.entity';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/invalid-credentials.exception';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';

interface UseCaseResult {
  token: string;
  expiresIn: number;
}

@Injectable()
export class SignInUseCase {
  constructor(
    private hasher: Hasher,
    private tokenProvider: TokenProvider,
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository
  ) {}

  public async execute(dto: SignInRequestDTO, context: RequestContextDTO): Promise<UseCaseResult> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.hasher.compare(dto.password, user.getPassword());

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const { hash, token } = this.tokenProvider.generate();

    const expiresAt = addDays(new Date(), 7);

    const session = Session.create({
      userId: user.getId(),
      token: hash,
      expiresAt,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
    await this.sessionRepository.save(session);

    const expiresIn = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    return {
      token,
      expiresIn,
    };
  }
}
