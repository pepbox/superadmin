import { Session } from "../models/session.model";
import { ISession, SessionStatus } from "../types/session";

export class SessionService {
  private SessionModel = Session;

  async createSession({
    name,
    game,
    playerLink,
    adminLink,
    adminPin,
    adminName,
    gameSessionId,
  }: {
    name: string;
    game: string;
    playerLink: string;
    adminLink: string;
    adminPin: string;
    adminName?: string;
    gameSessionId: string;
  }) {
    const newSession = new this.SessionModel({
      name,
      game,
      playerLink,
      adminLink,
      adminPin,
      gameSessionId,
      adminName,
    });
    return await newSession.save();
  }

  async updateSession(sessionId: string, updateData: Partial<ISession>) {
    return await this.SessionModel.findByIdAndUpdate(sessionId, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async getLiveSessions() {
    return await this.SessionModel.find({ status: SessionStatus.LIVE })
      .populate("game", "name gameId")
      .sort({ createdAt: -1 })
      .exec();
  }
  async getEndedSessions() {
    return await this.SessionModel.find({ status: SessionStatus.ENDED })
      .populate("game", "name gameId")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSessionById(sessionId: string) {
    return await this.SessionModel.findById(sessionId).populate("game").exec();
  }
}
