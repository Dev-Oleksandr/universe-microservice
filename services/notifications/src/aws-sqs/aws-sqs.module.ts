import { DynamicModule, Module } from '@nestjs/common';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SqsModule } from '@ssut/nestjs-sqs';
import { AwsSqsMessageHandler } from './aws-sqs-message.handler.js';

@Module({})
export class AwsSqsHandlerModule {
  static forFeaturePromises: Array<(module: DynamicModule) => void> = [];
  static module: DynamicModule;

  static async forRootAsync(): Promise<DynamicModule> {
    const sqs = new SQSClient({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.AWS_SQS_URL,
      useQueueUrlAsEndpoint: false,
    });
    this.module = {
      module: AwsSqsHandlerModule,
      providers: [
        {
          provide: 'SQS_CLIENT',
          useValue: sqs,
        },
        AwsSqsMessageHandler,
      ],
      imports: [
        SqsModule.registerAsync({
          useFactory: () => {
            return {
              consumers: [
                {
                  sqs,
                  queueUrl: process.env.AWS_SQS_URL!,
                  useQueueUrlAsEndpoint: false,
                  name: 'test-queue',
                  pollingWaitTimeMs: 3000,
                  visibilityTimeout: 3000,
                  heartbeatInterval: 1000,
                },
              ],
            };
          },
        }),
      ],
    };

    AwsSqsHandlerModule.forFeaturePromises.forEach((callback) =>
      callback(AwsSqsHandlerModule.module),
    );

    return AwsSqsHandlerModule.module;
  }
}
