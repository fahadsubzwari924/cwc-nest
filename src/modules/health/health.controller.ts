import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/utils/decorators/no-intercept.decorator';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Public()
  @Get()
  async check() {
    return await this.healthService.check();
  }
}
