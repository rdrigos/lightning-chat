import { IssuedToken } from '@/core/cryptography/token-provider.abstract';

export class IssuedTokenDTO implements IssuedToken {
  public token!: string;
  public issuedAt!: number;
  public expiresAt!: number;
}
