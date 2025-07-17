import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import { SessionService } from "../services/sessionService";
import { GameService } from "../../games/services/gameService";
import axios from "axios";
import { IGame } from "../../games/types/game";

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

      const data = {
        name,
        gameId,
        adminName,
        adminPin,
        gameConfig,
      };

      const remoteResponse = await this.makeRemoteGameRequest(
        game,
        game.endpoints.createSession,
        "POST",
        data
      );

      const newSession = await this.sessionService.createSession({
        name,
        game: game._id,
        adminLink: remoteResponse.adminLink,
        playerLink: remoteResponse.playerLink,
        gameSessionId: remoteResponse.sessionId, // Assuming this is returned from the remote server
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

  // controller for editing session at local and then at remote game server 
  editSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, sessionName, adminName, adminPin } = req.body;
      if (!sessionId || !sessionName || !adminName || !adminPin) {
        return next(new AppError("All fields are required", 400));
      }

      // Get the session to find the associated game
      const existingSession = await this.sessionService.getSessionById(
        sessionId
      );
      if (!existingSession) {
        return next(new AppError("Session not found", 404));
      }

      // Get the game details
      const game = existingSession.game as any as IGame;

      if (!game || !game.gameId) {
        return next(new AppError("Associated game not found", 404));
      }

      if (game.endpoints.updateSession) {
        const updateData = {
          sessionId: existingSession.gameSessionId,
          name: sessionName,
          adminName,
          adminPin,
        };

        await this.makeRemoteGameRequest(
          game,
          game.endpoints.updateSession,
          "POST",
          updateData
        );
      }

      // Update session in local database
      const updatedSession = await this.sessionService.updateSession(
        sessionId,
        {
          name: sessionName,
          adminName,
          adminPin,
        }
      );

      res.status(200).json({
        status: "success",
        message: "Session updated successfully",
        data: updatedSession,
      });
    } catch (error) {
      console.error("Error editing session:", error);
      next(new AppError("Failed to edit session", 500));
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

      const response = await this.makeRemoteGameRequest(
        game,
        endpoint,
        method,
        data
      );

      res.status(200).json({
        status: "success",
        message: "Custom game request processed successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error processing custom game request:", error);
      return next(new AppError("Failed to process custom game request", 500));
    }
  };

  private makeRemoteGameRequest = async (
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

      if (endpoint === game.endpoints.createSession) {
        if (!response.data.data.adminLink || !response.data.data.playerLink) {
          throw new AppError(
            "Invalid response from remote session creation",
            500
          );
        }
        return {
          sessionId: response.data.data.sessionId,
          adminLink: response.data.data.adminLink,
          playerLink: response.data.data.playerLink,
        };
      }

      // For other requests, return the response data
      return response.data;
    } catch (error) {
      console.error("Error making remote game request:", error);
      if (axios.isAxiosError(error)) {
        throw new AppError(
          `Remote server error: ${error.response?.data?.message || error.message
          }`,
          error.response?.status || 500
        );
      }
      throw new AppError("Failed to communicate with remote game server", 500);
    }
  };

  // this controller is for updating a session from another game.
  updateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameSessionId, totalPlayers, totalTeams, completedOn, status } = req.body;
      if (!gameSessionId) {
        return next(new AppError("gameSessionId is required", 400));
      }

      // Get the session to find the associated game
      const existingSession = await this.sessionService.getSessionByGameSessionId(
        gameSessionId
      );
      if (!existingSession) {
        return next(new AppError("Session not found", 404));
      }

      // Get the game details
      const game = existingSession.game as any as IGame;

      if (!game || !game.gameId) {
        return next(new AppError("Associated game not found", 404));
      }

      // Prepare update object with only provided fields
      const updateData: any = {}
      if (typeof totalPlayers !== "undefined") updateData.totalPlayers = totalPlayers;
      if (typeof totalTeams !== "undefined") updateData.totalTeams = totalTeams;
      if (typeof completedOn !== "undefined") updateData.completedOn = completedOn;
      if (typeof status !== "undefined") updateData.status = status;

      // Update session in local database
      const updatedSession = await this.sessionService.updateSessionByGameSessionId(
        gameSessionId,
        updateData
      );

      res.status(200).json({
        status: "success",
        message: "Session updated successfully",
        data: updatedSession,
      });
    } catch (error) {
      console.error("Error editing session:", error);
      next(new AppError("Failed to edit session", 500));
    }
  };


}



export const SessionControllers = new SessionController();
