import { IssuedToken, TokenClaims, TokenProvider } from '@/core/cryptography/token-provider.abstract';
import util from 'node:util';

export class FakeTokenProvider implements TokenProvider {
  private tokens = new Map<string, TokenClaims>();

  public async sign(userId: string): Promise<IssuedToken> {
    const issuedAt = Date.now();
    const expiresAt = issuedAt + 1000 * 60 * 60; // 1 Hour
    const token = util.format('fake-token-%s', userId);

    const claims: TokenClaims = {
      sub: userId,
      iss: 'fake',
      iat: Math.floor(issuedAt / 1000),
      exp: Math.floor(expiresAt / 1000),
    };

    this.tokens.set(token, claims);

    return {
      expiresAt,
      issuedAt,
      token,
    };
  }

  public async validate(token: string): Promise<TokenClaims | null> {
    const claims = this.tokens.get(token);

    if (!claims) return null;

    const now = Date.now() / 1000;
    if (claims.exp < now) {
      this.tokens.delete(token);
      return null;
    }

    return claims;
  }
}
