import { Session } from "../models/session.model";
import { SessionStatus } from "../types/session";

export class SessionService {
  private SessionModel = Session;

  async createSession({
    name,
    game,
    playerLink,
    adminLink,
    adminPin,
  }: {
    name: string;
    game: string;
    playerLink: string;
    adminLink: string;
    adminPin: string;
  }) {
    const newSession = new this.SessionModel({
      name,
      game,
      playerLink,
      adminLink,
      adminPin,
    });
    return await newSession.save();
  }

  async getLiveSessions() {
    return await this.SessionModel.find({ status: SessionStatus.LIVE })
      .populate("game", "name gameId")
      .exec();
  }
  async getEndedSessions() {
    return await this.SessionModel.find({ status: SessionStatus.ENDED })
      .populate("game", "name gameId")
      .exec();
  }
}
