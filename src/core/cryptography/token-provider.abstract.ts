export interface IssuedToken {
  token: string;
  issuedAt: number;
  expiresAt: number;
}

export interface TokenClaims {
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

export abstract class TokenProvider {
  abstract sign(userId: string): Promise<IssuedToken>;
  abstract validate(token: string): Promise<TokenClaims | null>;
}
