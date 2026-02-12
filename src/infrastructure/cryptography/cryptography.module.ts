import { Hasher } from '@/domain/cryptography/hasher.abstract';
import { TokenProvider } from '@/domain/cryptography/token-provider.abstract';
import { ArgonHasher } from '@/infrastructure/cryptography/hasher/argon.hasher';
import { CryptoTokenProvider } from '@/infrastructure/cryptography/token-provider/crypto.token-provider';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: Hasher,
      useClass: ArgonHasher,
    },
    {
      provide: TokenProvider,
      useClass: CryptoTokenProvider,
    },
  ],
  exports: [Hasher, TokenProvider],
})
export class CryptographyModule {}
