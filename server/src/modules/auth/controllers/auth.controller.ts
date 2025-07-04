import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import { AuthService } from "../services/authService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/cookieOptions";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    try {
      const admin = await this.authService.findAdminByEmail(email);
      if (!admin) {
        return next(new AppError("Admin not found", 404));
      }

      const isMatched = await this.authService.comparePassword(
        password,
        admin.password
      );
      if (!isMatched) {
        return next(new AppError("Incorrect password", 401));
      }

      const accessToken = generateAccessToken({ id: admin._id.toString() });
      const refreshToken = generateRefreshToken(admin._id.toString());

      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenOptions);

      res.status(200).json({
        status: "success",
        message: "Login successful",
        admin: {
          _id: admin._id,
          email: admin.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return next(new AppError("Login failed", 500));
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Refresh token is required", 401));
    }
    try {
      const payload = verifyRefreshToken(refreshToken);
      const accessToken = generateAccessToken({ id: payload.id });
      const newRefreshToken = generateRefreshToken(payload.id);
      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);
      res.status(200).json({
        status: "success",
        message: "Access token refreshed successfully",
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return next(new AppError("Invalid refresh token", 401));
    }
  };

  fetch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user.id;
      const admin = await this.authService.findAdminById(adminId);
      if (!admin) {
        return next(new AppError("Admin not found", 404));
      }
      res.status(200).json({
        status: "success",
        admin: {
          _id: admin._id,
          email: admin.email,
        },
      });
    } catch (error) {
      console.error("Fetch admin error:", error);
      return next(new AppError("Failed to fetch admin details", 500));
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return next(new AppError("Logout failed", 500));
    }
  };

  createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    try {
      const existingAdmin = await this.authService.findAdminByEmail(email);
      if (existingAdmin) {
        return next(new AppError("Admin already exists", 409));
      }

      const newAdmin = await this.authService.createAdmin(email, password);
      res.status(201).json({
        status: "success",
        message: "Admin created successfully",
        admin: {
          _id: newAdmin._id,
          email: newAdmin.email,
        },
      });
    } catch (error) {
      console.error("Create admin error:", error);
      return next(new AppError("Failed to create admin", 500));
    }
  };
}

export const AuthControllers = new AuthController();
