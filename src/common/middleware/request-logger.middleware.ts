import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const methodColors = {
        GET: '\x1b[32m', // Green
        POST: '\x1b[33m', // Yellow
        PUT: '\x1b[34m', // Blue
        PATCH: '\x1b[35m', // Magenta
        DELETE: '\x1b[31m', // Red
      };
      const color = methodColors[req.method] || '\x1b[37m'; // Default to white
      console.log(
        `[${color}${req.method}\x1b[0m] ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
