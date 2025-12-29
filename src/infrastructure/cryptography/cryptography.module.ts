import { Hasher } from '@/core/cryptography/hasher.abstract';
import { ArgonHasherService } from '@/infrastructure/cryptography/hasher/argon.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: Hasher,
      useClass: ArgonHasherService,
    },
  ],
  exports: [Hasher],
})
export class CryptographyModule {}
