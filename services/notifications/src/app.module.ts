import { Module } from '@nestjs/common';
import { AwsSqsHandlerModule } from './aws-sqs/aws-sqs.module.js';

@Module({
  imports: [AwsSqsHandlerModule.forRootAsync()],
  controllers: [],
  providers: [],
})
export class AppModule {}
