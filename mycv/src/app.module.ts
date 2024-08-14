import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: new ConfigService().get('DATABASE_HOST'),
      port: parseInt(new ConfigService().get('DATABASE_PORT')),
      username: new ConfigService().get('DATABASE_USER'),
      password: new ConfigService().get('DATABASE_PASSWORD'),
      database: new ConfigService().get('DATABASE_NAME'),
      entities: [User, Report],
      // synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {}
