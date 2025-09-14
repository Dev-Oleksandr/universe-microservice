import { Inject, Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { DeleteMessageCommand, Message, SQSClient } from '@aws-sdk/client-sqs';
import { inspect } from 'util';
import * as process from 'node:process';

@Injectable()
export class AwsSqsMessageHandler {
  constructor(@Inject('SQS_CLIENT') private readonly awsSqsClient: SQSClient) {}

  private readonly logger = new Logger(AwsSqsMessageHandler.name);

  @SqsMessageHandler('test-queue', false)
  async handler(message: Message) {
    const callbackToDeleteMessage = async (handlerName: string) => {
      try {
        const command = new DeleteMessageCommand({
          QueueUrl: process.env.AWS_SQS_URL,
          ReceiptHandle: message.ReceiptHandle as string,
        });
        await this.awsSqsClient.send(command);
      } catch (error) {
        this.logger.error(
          `An error occurred when ${handlerName} processed a queue message to delete. Error:`,
        );
        this.logger.error(inspect(error));
      }
    };
    try {
      if (!message.Body) {
        this.logger.warn('There is an empty message Body. Message:');
        this.logger.warn(inspect(message));
        await callbackToDeleteMessage('EmptyMessage');
        return;
      }

      const { data, type } = JSON.parse(message.Body);

      this.logger.log(`Event type - ${type}`);
      this.logger.log(`data - ${JSON.stringify(data)}`);

      // logger prometheus
    } catch (e) {
      this.logger.error('Invalid message', e);
      throw e;
    }
  }
}
