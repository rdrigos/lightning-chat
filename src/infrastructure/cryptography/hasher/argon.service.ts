import { Hasher } from '@/core/cryptography/hasher.abstract';
import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class ArgonHasherService implements Hasher {
  public async hash(plain: string): Promise<string> {
    return await argon.hash(plain);
  }

  public async compare(plain: string, hash: string): Promise<boolean> {
    return await argon.verify(hash, plain);
  }
}
