import { ArrayMinSize, IsArray, IsInt, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  customerId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  workspaceId?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'An order must contain at least one product' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}