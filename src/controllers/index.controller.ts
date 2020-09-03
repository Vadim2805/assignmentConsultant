import { NextFunction, Request, Response } from 'express';

export class IndexController {
  public index = (req: Request, res: Response): Promise<void> => {
    res.sendStatus(200);
    return Promise.resolve();
  };
}
