import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.vo';
import { Session } from '@/modules/auth/entities/session.entity';

export abstract class SessionRepository {
  abstract save(session: Session): Promise<void>;
  abstract findAllByUserId(userId: UniqueEntityID): Promise<Session[]>;
}
