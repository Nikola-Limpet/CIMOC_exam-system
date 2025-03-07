import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DatabaseService } from './database.service';
import { DrizzleService } from './drizzle.service';
import { DRIZZLE_PROVIDER } from './database.constants';

@Global() // Make the module global to avoid multiple imports
@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    {
      provide: DRIZZLE_PROVIDER,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.get('DATABASE_URL'),
        });
        return drizzle(pool);
      },
    },
    DrizzleService,
    DatabaseService,
  ],
  exports: [DatabaseService, DrizzleService],
})
export class DatabaseModule { }
