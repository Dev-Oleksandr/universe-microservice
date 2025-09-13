import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service.js';
import { Response } from 'express';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async findMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', this.metricsService.getContentType());
    res.send(await this.metricsService.findMetrics());
  }
}
