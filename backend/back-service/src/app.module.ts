import { CoreModule } from '@core/core.module';
import { useMiddleware } from '@core/middleware';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(useMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
