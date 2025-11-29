import { Entity, EntityMetadata } from '@/core/entities/entity.abstract';
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.vo';

export interface SessionProps {
  userId: UniqueEntityID;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class Session extends Entity<SessionProps> {
  public getUserId(): UniqueEntityID {
    return this.props.userId;
  }

  public setUserId(userId: UniqueEntityID): this {
    this.props.userId = userId;
    this.touch();
    return this;
  }

  public getToken(): string {
    return this.props.token;
  }

  public setToken(token: string): this {
    this.props.token = token;
    this.touch();
    return this;
  }

  public getExpiresAt(): Date {
    return this.props.expiresAt;
  }

  public setExpiresAt(expiresAt: Date): this {
    this.props.expiresAt = expiresAt;
    this.touch();
    return this;
  }

  public getIpAddress(): string | undefined {
    return this.props.ipAddress;
  }

  public setIpAddress(ipAddress: string): this {
    this.props.ipAddress = ipAddress;
    this.touch();
    return this;
  }

  public getUserAgent(): string | undefined {
    return this.props.userAgent;
  }

  public setUserAgent(userAgent: string): this {
    this.props.userAgent = userAgent;
    this.touch();
    return this;
  }

  public static create(props: SessionProps, metadata?: EntityMetadata): Session {
    return new Session(props, metadata);
  }
}
