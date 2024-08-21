import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const cookieSession = require('cookie-session');

import ormconfig from '../ormconfig';
console.log('ormconfig', ormconfig);

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     type: 'postgres',
    //     host: config.get('DATABASE_HOST'),
    //     port: parseInt(config.get('DATABASE_PORT')),
    //     username: config.get('DATABASE_USER'),
    //     password: config.get('DATABASE_PASSWORD'),
    //     database: config.get('DATABASE_NAME'),
    //     entities: [User, Report],
    //     // logging: true,
    //     // synchronize: true,
    //   }),
    // }),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
