import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface EntityMetadata {
  id: UniqueEntityID;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class Entity<Props> {
  private readonly _id: UniqueEntityID;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  protected props: Props;

  protected constructor(props: Props, metadata?: EntityMetadata) {
    this._id = metadata?.id ?? new UniqueEntityID();
    this._createdAt = metadata?.createdAt ?? new Date();
    this._updatedAt = metadata?.updatedAt ?? new Date();
    this.props = props;
  }

  get id(): UniqueEntityID {
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
    if (other === this) {
      return true;
    }

    return this.id.equals(other.id);
  }
}
