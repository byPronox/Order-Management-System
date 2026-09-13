import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @Query('workspaceId') workspaceId?: string,
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
  ) {
    return this.ordersService.findAll({
      workspaceId: workspaceId ? +workspaceId : undefined,
      status,
      search,
    });
  }

  @Get('summary')
  getSummary(@Query('workspaceId') workspaceId?: string) {
    return this.ordersService.getSummary(workspaceId ? +workspaceId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.ordersService.findOne(+id, workspaceId ? +workspaceId : undefined);
  }
}