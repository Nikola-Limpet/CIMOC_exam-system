import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly ttl: number;
  private redisClient: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.ttl = this.configService.get<number>('REDIS_TTL', 3600);
  }

  async onModuleInit() {
    try {
      // Create Redis client using environment variables
      this.redisClient = createClient({
        username: this.configService.get('REDIS_USERNAME'),
        password: this.configService.get('REDIS_PASSWORD'),
        socket: {
          host: this.configService.get('REDIS_HOST'),
          port: this.configService.get<number>('REDIS_PORT')
        }
      });

      // Set up event handlers
      this.redisClient.on('error', (error) => {
        this.logger.error('Redis connection error:', error);
      });

      this.redisClient.on('connect', () => {
        this.logger.log('Connected to Redis Cloud server');
      });

      // Connect to Redis
      await this.redisClient.connect();

      // Test connection
      await this.redisClient.set('connection_test', 'success');
      const testResult = await this.redisClient.get('connection_test');
      this.logger.log(`Redis connection test: ${testResult}`);
    } catch (error) {
      this.logger.error('Failed to connect to Redis Cloud:', error);
    }
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.disconnect();
      this.logger.log('Redis connection closed');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const prefixedKey = `${this.configService.get('REDIS_PREFIX', 'exam_system:')}${key}`;
      const value = await this.redisClient.get(prefixedKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key} from Redis:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const prefixedKey = `${this.configService.get('REDIS_PREFIX', 'exam_system:')}${key}`;
      const expiryTime = ttl || this.ttl;
      await this.redisClient.set(prefixedKey, JSON.stringify(value), {
        EX: expiryTime
      });
    } catch (error) {
      this.logger.error(`Error setting key ${key} in Redis:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const prefixedKey = `${this.configService.get('REDIS_PREFIX', 'exam_system:')}${key}`;
      await this.redisClient.del(prefixedKey);
    } catch (error) {
      this.logger.error(`Error deleting key ${key} from Redis:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const prefixedKey = `${this.configService.get('REDIS_PREFIX', 'exam_system:')}${key}`;
      return (await this.redisClient.exists(prefixedKey)) === 1;
    } catch (error) {
      this.logger.error(`Error checking if key ${key} exists in Redis:`, error);
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      const prefixedKey = `${this.configService.get('REDIS_PREFIX', 'exam_system:')}${key}`;
      await this.redisClient.expire(prefixedKey, ttl);
    } catch (error) {
      this.logger.error(`Error setting expiry on key ${key} in Redis:`, error);
    }
  }
}
