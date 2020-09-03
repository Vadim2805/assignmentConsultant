import Axios from 'axios';
import { TrackTopEpisodesService } from './track.service';
import { TrackedRequest } from '../interfaces/track.interface';
import { PopularSeries } from 'interfaces/series.interface';

export class SeriesService {
  apiKey: string;

  constructor(
    private axios: typeof Axios,
    private trackTopEpisodesService: TrackTopEpisodesService
  ) {
    this.apiKey = process.env.API_KEY;
  }

  public getSeriesDetails(tvId: string) {
    return this.axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}?api_key=${this.apiKey}`
    );
  }

  public getAllSeasonsSeriesDetails(tvId: string, seasonsNumber: number) {
    const requests = [];
    for (let i = 1; i <= seasonsNumber; i += 1) {
      requests.push(
        this.axios.get(
          `https://api.themoviedb.org/3/tv/${tvId}/season/${i}?api_key=${this.apiKey}`
        )
      );
    }

    return this.axios.all(requests);
  }

  public async getPopularSeries(limit: number = 5): Promise<PopularSeries[]> {
    const trackedTopEpisodes = await this.trackTopEpisodesService.getTrackedRequests();

    if (!trackedTopEpisodes) {
      return Promise.resolve([]);
    }

    const popularSeries: PopularSeries[] = Object.values(trackedTopEpisodes)
      .sort(
        (a: TrackedRequest, b: TrackedRequest) => b.accessCount - a.accessCount
      )
      .slice(0, limit) as PopularSeries[];

    return Promise.resolve(popularSeries);
  }
}
