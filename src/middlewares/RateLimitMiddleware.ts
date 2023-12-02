import { rateLimit } from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 1000,
  max: 5
});