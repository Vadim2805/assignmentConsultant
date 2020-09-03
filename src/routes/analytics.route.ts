import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import Route from '../interfaces/routes.interface';
import { controllerAction } from '../utils/util';

export class AnalyticsRoute implements Route {
  public path = '/analytics';

  constructor(
    private analyticsController: AnalyticsController,
    public router: Router
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/popularSeries`,
      controllerAction(this.analyticsController.getPopularSeries)
    );
  }
}
