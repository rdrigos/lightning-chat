import { GeneratedToken, TokenProvider } from '@/domain/cryptography/token-provider.abstract';
import { v4 as uuidV4 } from 'uuid';

export class FakeTokenProvider implements TokenProvider {
  public generate(): GeneratedToken {
    const token = uuidV4();
    const hash = this.hash(token);

    return { hash, token };
  }

  public hash(token: string): string {
    return token.concat('-hashed');
  }

  public compare(token: string, hash: string): boolean {
    return token.concat('-hashed') === hash;
  }
}
