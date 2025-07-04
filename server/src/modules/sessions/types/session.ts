import mongoose from "mongoose";

export enum SessionStatus {
  LIVE = "LIVE",
  ENDED = "ENDED",
}

export interface ISession {
  name: string;
  game: mongoose.Types.ObjectId;
  status: SessionStatus;
  playerLink: string;
  adminLink: string;
  adminPin:string;
}
