import { UniqueEntityId } from '@/domain/value-objects/unique-entity-id.vo';

export interface EntityMetadata {
  id?: UniqueEntityId;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<Props> {
  private readonly _id: UniqueEntityId;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  protected props: Props;

  constructor(props: Props, metadata?: EntityMetadata) {
    this._id = metadata?.id ?? new UniqueEntityId();
    this._createdAt = metadata?.createdAt ?? new Date();
    this._updatedAt = metadata?.updatedAt ?? new Date();
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  public equals(other: Entity<unknown>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other === this) {
      return true;
    }

    return this.id.equals(other.id);
  }
}
