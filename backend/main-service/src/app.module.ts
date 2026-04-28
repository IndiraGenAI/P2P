import { CoreModule } from '@core/core.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModules } from './modules/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    ...ApplicationModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
