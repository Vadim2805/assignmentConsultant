import { SeriesService } from './series.service';
import { TrackTopEpisodesService } from './track.service';
import { Episode } from 'interfaces/episodes.interface';

export class EpisodeService {
  constructor(
    private seriesService: SeriesService,
    private trackTopEpisodesService: TrackTopEpisodesService
  ) {}

  public async getSeriesEpisodes(seriesId: string): Promise<Episode[]> {
    try {
      const seriesDetails = await this.seriesService.getSeriesDetails(seriesId);

      this.trackTopEpisodesService.trackRequest(
        seriesId,
        seriesDetails.data.name
      );

      let seasons = await this.seriesService.getAllSeasonsSeriesDetails(
        seriesId,
        seriesDetails.data.number_of_seasons
      );

      const episodesRaw = seasons
        .map((season) => {
          return season.data.episodes;
        })
        .reduce((a, b) => {
          return a.concat(b);
        });

      const episodes = episodesRaw.map((episode: any) => ({
        episodeName: episode.name,
        averageVotes: episode.vote_average,
      }));

      return Promise.resolve(episodes);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async getTopSeriesEpisodes(
    seriesId: string,
    limit: number = 20
  ): Promise<Episode[]> {
    try {
      const cashedValue = await this.trackTopEpisodesService.getTrackedTopEpisodes(
        seriesId
      );

      if (cashedValue) {
        this.trackTopEpisodesService.trackRequest(seriesId);
        return Promise.resolve(cashedValue);
      }

      const episodes = await this.getSeriesEpisodes(seriesId);

      const topEpisodes = episodes
        .sort((a: Episode, b: Episode) => {
          return b.averageVotes - a.averageVotes;
        })
        .slice(0, limit);

      this.trackTopEpisodesService.trackTopEpisodes(seriesId, topEpisodes);

      return Promise.resolve(topEpisodes);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
