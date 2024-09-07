import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Здесь вы можете указать конкретный тип для `user`, если он известен
    }
  }
}