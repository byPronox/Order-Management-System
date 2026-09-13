import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatus } from '../../orders/entities/order.entity';

export class UpdateWorkspaceSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  workspaceName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  defaultTimezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  defaultCurrency?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  defaultOrderStatus?: OrderStatus;

  @IsOptional()
  @IsBoolean()
  requireOrderReview?: boolean;

  @IsOptional()
  @IsBoolean()
  allowPartialFulfillment?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyCustomersOnStatus?: boolean;
}