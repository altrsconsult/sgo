import jwt from 'jsonwebtoken';
import { env } from './env.js';

interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

// Gera token JWT com expiração de 7 dias
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
}

// Verifica e decodifica token JWT
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
