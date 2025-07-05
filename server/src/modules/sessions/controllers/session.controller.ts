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
      const game = await this.gameService.getGameByGameId(gameId);
      if (!game) {
        return next(new AppError("Game not found", 404));
      }
      const createSessionEndpoint = `${game.serverUrl}/${game.endpoints.createSession}`;
      const data = {
        name,
        gameId,
        adminName,
        adminPin,
        gameConfig,
      };
      const { adminLink, playerLink } = await this.createRemoteSession(
        createSessionEndpoint,
        data
      );

      console.log("Admin Link:", adminLink);
      console.log("Player Link:", playerLink);

      const newSession = await this.sessionService.createSession({
        name,
        game: game._id,
        adminLink,
        playerLink,
        adminPin,
        adminName,
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
        message: "Sessions fetched successfully",
        data: sessions,
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      next(error);
    }
  };

  customGameRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { gameId, endpoint, method, data } = req.body;
    if (!gameId || !endpoint || !method) {
      return next(
        new AppError("Game ID, endpoint, and method are required", 400)
      );
    }
    try {
      const game = await this.gameService.getGameByGameId(gameId);
      if (!game) {
        return next(new AppError("Game not found", 404));
      }
      await this.handleCustomGameRequest(
        req,
        res,
        next,
        game,
        endpoint,
        method,
        data
      );
      // If the request is successful, the response will be sent in handleCustomGameRequest
    } catch (error) {
      console.error("Error processing custom game request:", error);
      return next(new AppError("Failed to process custom game request", 500));
    }
  };

  private createRemoteSession = async (
    createSessionEndpoint: string,
    data: any
  ) => {
    const response = await axios.post(createSessionEndpoint, data);
    if (response.status !== 201) {
      throw new AppError("Failed to create remote session", response.status);
    }

    console.log("Remote session created successfully:", response.data);

    if (!response.data.data.adminLink || !response.data.data.playerLink) {
      throw new AppError("Invalid response from remote session creation", 500);
    }

    return {
      adminLink: response.data.data.adminLink,
      playerLink: response.data.data.playerLink,
    };
  };

  private handleCustomGameRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
    game: any,
    endpoint: string,
    method: string,
    data?: any
  ) => {
    const url = `${game.serverUrl}/${endpoint}`;
    try {
      const response = await axios({
        method: method.toLowerCase(),
        url: url,
        data: data,
      });
      res.status(response.status).json({
        status: "success",
        message: "Custom game request processed successfully",
        data: response.data,
      });
    } catch (error) {
      console.error("Error processing custom game request:", error);
      next(new AppError("Failed to process custom game request", 500));
    }
  };
}

export const SessionControllers = new SessionController();
