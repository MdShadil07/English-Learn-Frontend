import { Request, Response, NextFunction } from 'express';
import { redisCache } from '../config/redis';
import { database } from '../config/database';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
}

export class APIError extends Error implements AppError {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ErrorMonitor {
  private maxLogs = 1000; // Keep only last 1000 error logs in memory

  async logError(error: ErrorLog): Promise<void> {
    try {
      // Add to Redis for persistence
      const logKey = `error:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      await redisCache.setJSON(logKey, error, 86400); // Keep for 24 hours

      // Also log to console with structured format
      console.error(`[${error.level.toUpperCase()}] ${error.message}`, {
        id: error.id,
        timestamp: error.timestamp,
        userId: error.userId,
        url: error.url,
        statusCode: error.statusCode,
        stack: error.stack,
      });

      // Clean up old logs if we have too many
      await this.cleanupOldLogs();

    } catch (logError) {
      // Fallback to console if Redis logging fails
      console.error('Failed to log error to Redis:', logError);
      console.error('Original error:', error);
    }
  }

  private async cleanupOldLogs(): Promise<void> {
    try {
      // This is a simple cleanup - in production you'd want more sophisticated cleanup
      const keys = await redisCache.get('error_keys') || '[]';
      const errorKeys: string[] = JSON.parse(keys);

      if (errorKeys.length > this.maxLogs) {
        const keysToDelete = errorKeys.slice(0, errorKeys.length - this.maxLogs);
        for (const key of keysToDelete) {
          await redisCache.del(key);
        }

        const remainingKeys = errorKeys.slice(-this.maxLogs);
        await redisCache.set('error_keys', JSON.stringify(remainingKeys), 86400);
      }
    } catch (error) {
      console.error('Error cleaning up logs:', error);
    }
  }

  async getErrorStats(hours: number = 24): Promise<{
    totalErrors: number;
    errorsByLevel: Record<string, number>;
    errorsByEndpoint: Record<string, number>;
    recentErrors: ErrorLog[];
  }> {
    try {
      // In a real implementation, you'd query Redis or a proper logging service
      // For now, return mock data
      return {
        totalErrors: 0,
        errorsByLevel: {},
        errorsByEndpoint: {},
        recentErrors: [],
      };
    } catch (error) {
      console.error('Error getting error stats:', error);
      return {
        totalErrors: 0,
        errorsByLevel: {},
        errorsByEndpoint: {},
        recentErrors: [],
      };
    }
  }
}

export const errorMonitor = new ErrorMonitor();

export const errorHandler = async (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const errorLog: ErrorLog = {
    id: errorId,
    timestamp: new Date(),
    level: 'error',
    message: err.message,
    stack: err.stack,
    userId: (req as any).user?.id,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    statusCode: err.statusCode || 500,
  };

  // Log the error
  await errorMonitor.logError(errorLog);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new APIError(message, 404);
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new APIError(message, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = 'Invalid input data';
    error = new APIError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new APIError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new APIError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    errorId,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Enhanced health check with performance metrics
export const enhancedHealthCheck = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    const healthData = {
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: database.isConnected(),
        name: database.getConnection()?.name,
      },
      cache: {
        connected: redisCache.isConnected(),
      },
      memory: {
        rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100, // MB
        heapUsed: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100, // MB
        heapTotal: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100, // MB
      },
      responseTime: Date.now() - startTime,
    };

    const statusCode = healthData.database.connected && healthData.cache.connected ? 200 : 503;

    res.status(statusCode).json(healthData);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
    });
  }
};

export default errorMonitor;
