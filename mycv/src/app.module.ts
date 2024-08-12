import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [UsersModule, ReportsModule],
})
export class AppModule {}
