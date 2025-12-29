import { UniqueEntityID } from '@/domain/entities/value-objects/unique-entity-id.vo';

export interface EntityMetadata {
  id: UniqueEntityID;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class Entity<Props> {
  private readonly id: UniqueEntityID;
  private readonly createdAt: Date;
  private updatedAt: Date;
  protected props: Props;

  protected constructor(props: Props, metadata?: EntityMetadata) {
    this.id = metadata?.id ?? new UniqueEntityID();
    this.createdAt = metadata?.createdAt ?? new Date();
    this.updatedAt = metadata?.updatedAt ?? new Date();
    this.props = props;
  }

  public getId(): string {
    return this.id.toValue();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }

  public equals(entity: Entity<unknown>): boolean {
    if (entity === this) {
      return true;
    }

    if (entity.id === this.id) {
      return true;
    }

    return false;
  }
}
