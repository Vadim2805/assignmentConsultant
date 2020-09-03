import 'dotenv/config';
import App from './app';
import IndexRoute from './routes/index.route';
import { EpisodesRoute } from './routes/episodes.route';
import { AnalyticsRoute } from './routes/analytics.route';
import validateEnv from './utils/validateEnv';
import { Router } from 'express';
import axios from 'axios';
import * as redis from 'redis';
/* Episode dependencies */
import { EpisodesController } from './controllers/episode.controller';
import { EpisodeService } from './services/episode.service';
import { SeriesService } from './services/series.service';
import { CacheService } from './services/cache.service';
/* Analytics dependencies */
import { AnalyticsController } from './controllers/analytics.controller';
/* other  dependencies*/
import { TrackTopEpisodesService } from './services/track.service';

validateEnv();

const router = Router();
const redisClient = initRedis();
const cacheService = new CacheService(redisClient);
const trackService = new TrackTopEpisodesService(cacheService);

const seriesService = new SeriesService(axios, trackService);
const episodeService = new EpisodeService(seriesService, trackService);
const episodesController = new EpisodesController(episodeService);
const analyticsController = new AnalyticsController(seriesService);

const app = new App([
  new IndexRoute(),
  new EpisodesRoute(episodesController, router),
  new AnalyticsRoute(analyticsController, router),
]);

app.listen();

function initRedis(): redis.RedisClient {
  const client = redis.createClient({
    url: process.env.REDIS_URL,
  });

  client.on('error', (error) => {
    console.error(error);
  });

  /*client.set('key_1', 'value', (err, res) => {
    console.log(err, res);
  });
  client.get('key_1', (err, res) => {
    console.log(err, res);
  });*/

  return client;
}
