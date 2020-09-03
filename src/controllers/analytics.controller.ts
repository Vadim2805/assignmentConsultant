import { NextFunction, Request, Response } from 'express';
import { EpisodeService } from '../services/episode.service';
import { SeriesService } from '../services/series.service';

export class AnalyticsController {
  constructor(private seriesService: SeriesService) {}

  public getPopularSeries = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const popularSeries = await this.seriesService.getPopularSeries();
    res.status(200).json({ series: popularSeries });
    return Promise.resolve();
  };
}
