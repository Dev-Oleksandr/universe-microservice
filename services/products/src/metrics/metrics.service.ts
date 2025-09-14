import { Inject, Injectable } from '@nestjs/common';
import { Counter, Registry } from 'prom-client';
import { OPS_COUNTER, PROM_REGISTRY } from './constants.js';

@Injectable()
export class MetricsService {
  constructor(
    @Inject(OPS_COUNTER) private readonly ops: Counter,
    @Inject(PROM_REGISTRY) private readonly registry: Registry,
  ) {}

  increment(options: { action: 'create' | 'delete'; entity: string }): void {
    this.ops.inc(options);
  }

  getContentType() {
    return this.registry.contentType;
  }

  findMetrics() {
    return this.registry.metrics();
  }
}
