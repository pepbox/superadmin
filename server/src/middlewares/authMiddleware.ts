import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { verifyAccessToken } from '../modules/auth/utils/jwtUtils';

dotenv.config();

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    return; 
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next(); 
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    return; 
  }
};



