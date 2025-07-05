import mongoose from "mongoose";
import { Game } from "../models/game.model";

export class GameService {
  private GameModel = Game;

  async getAllGames() {
    const games = await this.GameModel.find().exec();
    return games;
  }

  async getGameByGameId(gameId: string) {
    const game = await this.GameModel.findOne({ gameId: gameId }).exec();
    if (!game) {
      throw new Error("Game not found");
    }
    return game;
  }

  async getGameById(id: string | mongoose.Types.ObjectId) {
    const game = await this.GameModel.findById(id).exec();
    if (!game) {
      throw new Error("Game not found");
    }
    return game;
  }

  async createGame({
    gameId,
    name,
    serverUrl,
    endpoints,
  }: {
    gameId: string;
    name: string;
    serverUrl: string;
    endpoints: {
      createSession?: string;
      getSession?: string;
      updateSession?: string;
      deleteSession?: string;
    };
  }) {
    const newGame = new this.GameModel({
      gameId,
      name,
      serverUrl,
      endpoints,
    });
    return await newGame.save();
  }
}
