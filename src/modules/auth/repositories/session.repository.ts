import { Session } from '@/modules/auth/entities/session.entity';

export abstract class SessionRepository {
  abstract save(session: Session): Promise<void>;
  abstract findByUserId(userId: string): Promise<Session[]>;
}
