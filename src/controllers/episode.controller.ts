import { NextFunction, Request, Response } from 'express';
import { EpisodeService } from '../services/episode.service';

export class EpisodesController {
  constructor(private episodeService: EpisodeService) {}

  public getTopEpisodes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const topEpisodes = await this.episodeService.getTopSeriesEpisodes(
      req.params.seriesId
    );
    res.status(200).json({ episodes: topEpisodes });
    return Promise.resolve();
  };
}
