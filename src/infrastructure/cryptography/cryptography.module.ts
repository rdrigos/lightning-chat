import { Hasher } from '@/core/cryptography/hasher.abstract';
import { HasherService } from '@/infrastructure/cryptography/hasher.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: Hasher,
      useClass: HasherService,
    },
  ],
  exports: [HasherService],
})
export class CryptographyModule {}
