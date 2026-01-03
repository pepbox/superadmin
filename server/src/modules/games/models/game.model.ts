import { IGame } from "../types/game";
import { Schema, model } from "mongoose";

const gameSchema: Schema<IGame> = new Schema<IGame>(
  {
    name: {
      type: String,
      required: true,
    },
    gameId: {
      type: String,
      required: true,
      unique: true,
    },
    serverUrl: {
      type: String,
      required: true,
    },
    endpoints: {
      createSession: {
        type: String,
      },
      getSession: {
        type: String,
      },
      updateSession: {
        type: String,
      },
      deleteSession: {
        type: String,
      },
      endSession: {
        type: String,
      }
    },
  },
  {
    timestamps: true,
  }
);

export const Game = model<IGame>("Game", gameSchema);
