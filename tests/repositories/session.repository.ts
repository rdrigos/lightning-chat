import { Session } from '@/modules/auth/entities/session.entity';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';

export class InMemorySessionRepository implements SessionRepository {
  private sessions: Session[] = [];

  public reset(): void {
    this.sessions = [];
  }

  public async save(session: Session): Promise<void> {
    const index = this.sessions.findIndex((stored) => stored.getId() === session.getId());
    index >= 0 ? (this.sessions[index] = session) : this.sessions.push(session);
  }

  public async findByUserId(userId: string): Promise<Session[]> {
    return this.sessions.filter((session) => session.getUserId().toValue() === userId);
  }
}
