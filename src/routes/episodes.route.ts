import { Router } from 'express';
import { EpisodesController } from '../controllers/episode.controller';
import Route from '../interfaces/routes.interface';
import { controllerAction } from '../utils/util';

export class EpisodesRoute implements Route {
  public path = '/topEpisodes';

  constructor(
    private episodesController: EpisodesController,
    public router: Router
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:seriesId(\\d+)`,
      controllerAction(this.episodesController.getTopEpisodes)
    );
  }
}
