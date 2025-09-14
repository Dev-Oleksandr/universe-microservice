import { Module } from '@nestjs/common';
import { SQSClient } from '@aws-sdk/client-sqs';
import { AwsSqsService } from './aws-sqs.service.js';
import { NOTIFY_QUEUE_URL, SQS_CLIENT } from './constants.js';

@Module({
  providers: [
    AwsSqsService,
    {
      provide: SQS_CLIENT,
      useFactory: () =>
        new SQSClient({
          region: process.env.AWS_DEFAULT_REGION,
          endpoint: process.env.AWS_SQS_URL,
          useQueueUrlAsEndpoint: false,
        }),
    },
    { provide: NOTIFY_QUEUE_URL, useValue: process.env.AWS_SQS_URL },
  ],
  exports: [AwsSqsService],
})
export class AwsSqsModule {}
