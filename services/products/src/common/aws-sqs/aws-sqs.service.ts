import { Inject, Injectable } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { CreateProductDto } from '../../products/schemas/create-product.dto.js';

@Injectable()
export class AwsSqsService {
  constructor(@Inject('SQS_CLIENT') private readonly sqsClient: SQSClient) {}

  async onCreateProduct(dto: CreateProductDto) {
    const message = JSON.stringify({
      type: 'product.created',
      data: dto,
    });
    const command = new SendMessageCommand({
      MessageBody: message,
      QueueUrl: process.env.AWS_SQS_URL,
    });
    await this.sqsClient.send(command);
  }
}
