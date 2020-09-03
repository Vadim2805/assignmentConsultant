import { NextFunction, Request, Response } from 'express';

export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export function controllerAction(
  action: (req: Request, res: Response) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await action(req, res);
    } catch (e) {
      next(e);
    }
  };
}
