import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { config } from "../../config/index.js";
import { authRepository } from "./auth.repository.js";
import { AppError } from "../../middleware/errorHandler.js";
import type { CrmRole } from "@prisma/client";
import type { JwtPayload } from "../../types/index.js";

const SALT_ROUNDS = 10;

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  employeeId: string;
  email: string;
  password: string;
  role?: CrmRole;
}

export interface TokenResult {
  token: string;
  expiresIn: string;
  user: { id: string; employeeId: string; email: string; role: CrmRole };
}

const DB_SETUP_MESSAGE =
  "Database not set up. Run 'npm run db:setup' from the project root (or fix DB permissions).";

const PRISMA_GENERATE_MESSAGE =
  "Database client out of date. Run: npx prisma generate && npm run db:seed, then restart the server.";

const DB_UNREACHABLE_MESSAGE =
  "Database unreachable. Check DATABASE_URL in .env, ensure PostgreSQL is running and reachable (e.g. VPN if using a remote host).";

function isPrismaOrClientError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError) return true;
  if (err instanceof Prisma.PrismaClientInitializationError) return true;
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : "";
  if (name === "PrismaClientInitializationError") return true;
  return (
    /prisma|findUnique|crmUser|organization|Can't reach database server|ECONNREFUSED|ETIMEDOUT/i.test(msg)
  );
}

export const authService = {
  async login(input: LoginInput): Promise<TokenResult> {
    try {
      let user;
      try {
        user = await authRepository.findByEmail(input.email);
      } catch (err) {
        if (err instanceof AppError) throw err;
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2021") {
          throw new AppError(503, DB_SETUP_MESSAGE);
        }
        if (isPrismaOrClientError(err)) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("[auth] login DB/client error", err);
          if (/Can't reach database server|ECONNREFUSED|ETIMEDOUT/i.test(msg)) {
            throw new AppError(503, DB_UNREACHABLE_MESSAGE);
          }
          throw new AppError(503, PRISMA_GENERATE_MESSAGE);
        }
        throw err;
      }
      if (!user) throw new AppError(401, "Invalid email or password");

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new AppError(401, "Invalid email or password");

      const payload: Omit<JwtPayload, "iat" | "exp"> = {
        sub: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
      });
      return {
        token,
        expiresIn: config.jwt.expiresIn,
        user: { id: user.id, employeeId: user.employeeId, email: user.email, role: user.role },
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      console.error("[auth] login error", err);
      throw new AppError(503, "Login temporarily unavailable. Check server logs or try again.");
    }
  },

  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new AppError(400, "Email already registered");

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await authRepository.create({
      employeeId: input.employeeId,
      email: input.email,
      passwordHash,
      role: input.role ?? "VIEWER",
    });
    return {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    };
  },

  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found");
    return { id: user.id, employeeId: user.employeeId, email: user.email, role: user.role };
  },
};
