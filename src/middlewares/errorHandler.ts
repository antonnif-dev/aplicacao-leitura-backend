import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Erro interno:", err);
  res.status(err.status || 500).json({
    message: err.message || "Erro interno no servidor",
  });
}