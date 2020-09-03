import { CacheService } from './cache.service';
import { TrackedRequest } from 'interfaces/track.interface';

export class TrackTopEpisodesService {
  private seriesEpisodesTrackKey: string = 'seriesEpisodes';

  constructor(private cacheService: CacheService) {}

  /*
   * Save top episodes found by seriesId
   */
  public trackTopEpisodes(seriesId: string, data: any[]): Promise<any> {
    return this.cacheService.setValue(this.getResponseTrackKey(seriesId), data);
  }

  /*
   * Get top episodes found by seriesId
   */
  public getTrackedTopEpisodes(seriesId: string): Promise<any[]> {
    return this.cacheService.getValue(this.getResponseTrackKey(seriesId));
  }

  /*
   * Track number of requests top episodes by seriesId
   */
  public async trackRequest(
    seriesId: string,
    seriesName?: string
  ): Promise<any> {
    const trackKey = this.getRequestTrackKey();
    const trackedRequests = (await this.cacheService.getValue(trackKey)) || {};
    if (!trackedRequests[seriesId]) {
      trackedRequests[seriesId] = { accessCount: 0 };
    }

    trackedRequests[seriesId].accessCount =
      trackedRequests[seriesId]!.accessCount + 1;
    if (!!seriesName) {
      trackedRequests[seriesId].seriesName = seriesName;
    }

    return this.cacheService.setValue(trackKey, trackedRequests);
  }

  /*
   * Get number of top episodes requests by seriesId
   */
  public getTrackedRequest(seriesId: string): Promise<TrackedRequest> {
    return new Promise((resolve, reject) => {
      this.getTrackedRequests()
        .then((trackedRequests) => {
          resolve(trackedRequests[seriesId]);
        })
        .catch((err) => reject(err));
    });
  }

  /*
   * Get all top episodes requests
   */
  public getTrackedRequests(): Promise<{ [key: string]: TrackedRequest }> {
    const trackKey = this.getRequestTrackKey();
    return this.cacheService.getValue(trackKey);
  }

  private getResponseTrackKey(seriesId: string): string {
    return `${this.seriesEpisodesTrackKey}:${seriesId}`;
  }

  private getRequestTrackKey(): string {
    return `${this.seriesEpisodesTrackKey}Count`;
  }
}
