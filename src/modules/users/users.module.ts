import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CryptographyModule],
})
export class UsersModule {}
