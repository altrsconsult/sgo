import 'dotenv/config';
import { config } from 'dotenv';
config();

// Configurações de ambiente do chassi backend
export const env = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://sgo:sgodev@localhost:5432/sgo',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  // Nexus Central — quando configurado, chassi opera em modo gerenciado
  nexusUrl: process.env.NEXUS_URL || null,
  // Ativa host.docker.internal no devModulesSync
  dockerEnv: process.env.DOCKER_ENV === 'true',
};
