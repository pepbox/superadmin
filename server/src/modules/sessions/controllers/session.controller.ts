import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import { SessionService } from "../services/sessionService";
import { GameService } from "../../games/services/gameService";
import axios from "axios";

class SessionController {
  private sessionService: SessionService;
  private gameService: GameService;

  constructor() {
    this.sessionService = new SessionService();
    this.gameService = new GameService();
  }

  createSession = async (req: Request, res: Response, next: NextFunction) => {
    const { name, gameId, adminName, adminPin, gameConfig } = req.body;

    if (!name || !gameId || !adminName || !adminPin || !gameConfig) {
      return next(new AppError("All fields are required", 400));
    }

    try {
      const game = await this.gameService.getGameById(gameId);
      if (!game) {
        return next(new AppError("Game not found", 404));
      }
      const createSessionEndpoint = `${game.serverUrl}/${game.endpoints.createSession}`;
      const { adminLink, playerLink } = await this.createRemoteSession(
        createSessionEndpoint,
        gameConfig
      );

      const newSession = await this.sessionService.createSession({
        name,
        game: gameId,
        adminLink,
        playerLink,
        adminPin,
      });
      res.status(201).json({
        status: "success",
        message: "Session created successfully",
        data: newSession,
      });
    } catch (error) {
      console.error("Error creating session:", error);
      next(error);
    }
  };

  getSessions = async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.query;
    try {
      let sessions;
      if (status === "live") {
        sessions = await this.sessionService.getLiveSessions();
      } else if (status === "ended") {
        sessions = await this.sessionService.getEndedSessions();
      } else {
        return next(new AppError("Invalid status query parameter", 400));
      }
      res.status(200).json({
        status: "success",
        message: "Live sessions fetched successfully",
        data: sessions,
      });
    } catch (error) {
      console.error("Error fetching live sessions:", error);
      next(error);
    }
  };

  private createRemoteSession = async (
    createSessionEndpoint: string,
    gameConfig: any
  ) => {
    const response = await axios.post(createSessionEndpoint, {
      gameConfig: gameConfig,
    });
    if (response.status !== 200) {
      throw new AppError("Failed to create remote session", response.status);
    }
    return {
      adminLink: response.data.adminLink,
      playerLink: response.data.playerLink,
    };
  };
}

export const SessionControllers = new SessionController();
