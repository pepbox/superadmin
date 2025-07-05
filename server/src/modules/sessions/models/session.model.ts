import { ISession, SessionStatus } from "../types/session";
import { Schema, model } from "mongoose";

const sessionSchema: Schema<ISession> = new Schema<ISession>(
  {
    name: {
      type: String,
      required: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    status: {
      type: String,
      enum: SessionStatus,
      default: SessionStatus.LIVE,
    },
    playerLink: {
      type: String,
      required: true,
    },
    adminLink: {
      type: String,
      required: true,
    },
    adminName: {
      type: String,
    },
    adminPin: {
      type: String,
      required: true,
    },
    totalPlayers: {
      type: Number,
      default: 0,
    },
    totalTeams: {
      type: Number,
      default: 0,
    },
    completedOn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Session = model<ISession>("Session", sessionSchema);
