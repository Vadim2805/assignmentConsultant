import * as request from 'supertest';
import App from '../app';
import { EpisodesRoute } from '../routes/episodes.route';
import { EpisodesController } from '../controllers/episode.controller';
import { EpisodeService } from '../services/episode.service';
import { SeriesService } from '../services/series.service';
import { NextFunction, Request, Response, Router } from 'express';
import { Episode } from 'interfaces/episodes.interface';

let mockEpisodes: Episode[] = [];

class MockEpisodesController {
  public getTopEpisodes(req: Request, res: Response) {
    res.status(200).json({ episodes: mockEpisodes });
    return Promise.resolve();
  }
}

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

let episodeController: EpisodesController;
let router: Router;

beforeEach(() => {
  episodeController = new MockEpisodesController() as EpisodesController;
  router = Router();
});

/*
 * Due to time limitation we have only one test here.
 */

describe('Testing Episodes', () => {
  describe('[GET] /topEpisodes/:seriesId', () => {
    it('response statusCode 200', () => {
      const episodesRoute = new EpisodesRoute(episodeController, router);
      const app = new App([episodesRoute]);

      return request(app.getServer())
        .get('/topEpisodes/1')
        .expect(200, { episodes: mockEpisodes });
    });
  });
});
