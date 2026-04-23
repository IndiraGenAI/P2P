import { SkipAuth } from '@core/guards/role.guard';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipAuth()
  @Get('/check-health')
  checkHealth(): string {
    return this.appService.getHealth();
  }
}
