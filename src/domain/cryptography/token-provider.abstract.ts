export interface GeneratedToken {
  token: string;
  hash: string;
}

export abstract class TokenProvider {
  abstract generate(): GeneratedToken;
  abstract hash(token: string): string;
  abstract compare(token: string, hash: string): boolean;
}
