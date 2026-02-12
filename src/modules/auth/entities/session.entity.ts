import { Entity, EntityMetadata } from '@/domain/entities/entity.abstract';
import { UniqueEntityID } from '@/domain/entities/value-objects/unique-entity-id.vo';

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

  public setUserId(value: UniqueEntityID): this {
    this.props.userId = value;
    this.touch();
    return this;
  }

  public getToken(): string {
    return this.props.token;
  }

  public setToken(value: string): this {
    this.props.token = value;
    this.touch();
    return this;
  }

  public getExpiresAt(): Date {
    return this.props.expiresAt;
  }

  public setExpiresAt(value: Date): this {
    this.props.expiresAt = value;
    this.touch();
    return this;
  }

  public getIpAddress(): string | undefined {
    return this.props.ipAddress;
  }

  public setIpAddress(value: string | undefined): this {
    this.props.ipAddress = value;
    this.touch();
    return this;
  }

  public getUserAgent(): string | undefined {
    return this.props.userAgent;
  }

  public setUserAgent(value: string | undefined): this {
    this.props.userAgent = value;
    this.touch();
    return this;
  }

  public isExpired(): boolean {
    return this.props.expiresAt.getTime() <= Date.now();
  }

  public static create(props: SessionProps, metadata?: EntityMetadata): Session {
    return new Session(props, metadata);
  }
}
