import { RedisClient } from 'redis';

export class CacheService {
  constructor(private client: RedisClient) {}

  public setValue(key: string, value: any): Promise<any> {
    const redisValue = JSON.stringify(value);
    return new Promise((resolve, reject) => {
      this.client.set(key, redisValue, (err, ok) => {
        if (err) {
          return reject(err);
        }

        resolve(ok);
      });
    });
  }

  public getValue(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          return reject(err);
        }
        if (!value) {
          return resolve(null);
        }
        resolve(JSON.parse(value));
      });
    });
  }
}
