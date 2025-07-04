import { NextFunction, Request, Response } from "express";
import { GameService } from "../services/gameService";
import AppError from "../../../utils/appError";

class GameController {
  private gamesService: GameService;

  constructor() {
    this.gamesService = new GameService();
  }

  fetchAllGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const games = await this.gamesService.getAllGames();
      const gamesData = games.map((game) => ({
        ...game.toObject(),
        serverUrl: undefined,
      }));
      res.status(200).json({
        status: "success",
        message: "Games fetched successfully",
        data: gamesData,
      });
    } catch (error) {
      console.error("Error fetching games:", error);
      next(error);
    }
  };

  createGame = async (req: Request, res: Response, next: NextFunction) => {
    const { gameId, name, serverUrl } = req.body;

    if (!gameId || !name || !serverUrl) {
      return next(new AppError("All fields are required", 400));
    }
    try {
      const newGame = await this.gamesService.createGame({
        gameId,
        name,
        serverUrl,
      });
      res.status(201).json({
        status: "success",
        message: "Game created successfully",
        data: newGame,
      });
    } catch (error) {
      console.error("Error creating game:", error);
      next(error);
    }
  };
}

export const GameControllers = new GameController();
