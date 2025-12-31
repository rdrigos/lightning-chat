import { Hasher } from '@/core/cryptography/hasher.abstract';
import { TokenProvider } from '@/core/cryptography/token-provider.abstract';
import { ArgonHasher } from '@/infrastructure/cryptography/hasher/argon.adapter';
import { JoseTokenProvider } from '@/infrastructure/cryptography/token-provider/jose.adapter';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule],
  providers: [
    {
      provide: Hasher,
      useClass: ArgonHasher,
    },
    {
      provide: TokenProvider,
      useClass: JoseTokenProvider,
    },
  ],
  exports: [Hasher, TokenProvider],
})
export class CryptographyModule {}
