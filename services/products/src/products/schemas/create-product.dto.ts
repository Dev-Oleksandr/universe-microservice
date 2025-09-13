import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateProductSchema = z.object({
  name: z.string().trim().min(1),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
