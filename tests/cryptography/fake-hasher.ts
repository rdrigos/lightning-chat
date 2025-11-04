import { Hasher } from '@/core/cryptography/hasher.abstract';

export class FakeHasher implements Hasher {
  public async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  public async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
