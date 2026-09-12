import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query('workspaceId') workspaceId?: string) {
    return this.ordersService.findAll(workspaceId ? +workspaceId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.ordersService.findOne(+id, workspaceId ? +workspaceId : undefined);
  }
}