import { IssuedToken, TokenClaims, TokenProvider } from '@/core/cryptography/token-provider.abstract';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { Injectable } from '@nestjs/common';
import { errors, jwtVerify, SignJWT } from 'jose';

interface ValidityPeriod {
  issuedAt: number;
  expiresAt: number;
}

@Injectable()
export class JoseTokenProvider implements TokenProvider {
  constructor(private env: EnvironmentService) {}

  private getIssuer(): string {
    return this.env.get('JWT_TOKEN_ISSUER');
  }

  private getSecret(): Uint8Array {
    const secret = this.env.get('JWT_TOKEN_SECRET');
    const encoder = new TextEncoder();
    return encoder.encode(secret);
  }

  private createValidityPeriod(expiresInSeconds: number): ValidityPeriod {
    const issuedAt = Math.floor(Date.now() / 1000);

    const expiresAt = issuedAt + expiresInSeconds;

    return {
      issuedAt,
      expiresAt,
    };
  }

  public async sign(userId: string): Promise<IssuedToken> {
    const { expiresAt, issuedAt } = this.createValidityPeriod(7 * 24 * 60 * 60); // 7 Days

    const token = await new SignJWT({
      sub: userId,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(this.getIssuer())
      .setIssuedAt(issuedAt)
      .setExpirationTime(expiresAt)
      .sign(this.getSecret());

    return {
      expiresAt,
      issuedAt,
      token,
    };
  }

  public async validate(token: string): Promise<TokenClaims | null> {
    try {
      const { payload } = await jwtVerify(token, this.getSecret(), {
        issuer: this.getIssuer(),
      });

      return payload as TokenClaims;
    } catch (error: unknown) {
      if (error instanceof errors.JWSSignatureVerificationFailed) {
        return null;
      }

      throw error;
    }
  }
}
