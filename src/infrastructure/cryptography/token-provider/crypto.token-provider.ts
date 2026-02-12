import { GeneratedToken, TokenProvider } from '@/domain/cryptography/token-provider.abstract';
import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class CryptoTokenProvider extends TokenProvider {
  private readonly SIZE = 32;
  private readonly ALGORITHM = 'sha256';
  private readonly ENCODING = 'base64url';

  public generate(): GeneratedToken {
    const token = crypto.randomBytes(this.SIZE).toString(this.ENCODING);
    const hash = this.hash(token);

    return { token, hash };
  }

  public hash(token: string): string {
    return crypto.createHash(this.ALGORITHM).update(token).digest(this.ENCODING);
  }

  public compare(token: string, hash: string): boolean {
    const hashed = this.hash(token);

    if (hashed.length !== hash.length) {
      return false;
    }

    return crypto.timingSafeEqual(Buffer.from(hashed), Buffer.from(hash));
  }
}
