import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AccessTokenPayload {
  id: string;
}
export interface RefreshTokenPayload {
  id: string;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  const { id } = payload;
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY || "900", 10),
  });
};

export const verifyAccessToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as AccessTokenPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY || "604800", 10),
  });
};

export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as {
      id: string;
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
