import { Global, Module } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';
import { MetricsService } from './metrics.service.js';
import { MetricsController } from './metrics.controller.js';

@Global()
@Module({
  controllers: [MetricsController],
  providers: [
    MetricsService,
    {
      provide: 'PROM_REGISTRY',
      useFactory: () => {
        const register = new Registry();
        collectDefaultMetrics({ register });
        return register;
      },
    },
    {
      provide: 'OPS_COUNTER',
      inject: ['PROM_REGISTRY'],
      useFactory: (register: Registry) => {
        const counter = new Counter({
          name: 'operation_count',
          help: 'Counter of operations',
          labelNames: ['action', 'entity'],
        });
        register.registerMetric(counter);
        return counter;
      },
    },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
