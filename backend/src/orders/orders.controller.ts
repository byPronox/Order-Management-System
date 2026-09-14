import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @Query('workspaceId') workspaceId?: string,
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.findAll({
      workspaceId: workspaceId ? +workspaceId : undefined,
      status,
      search,
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
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

  @Post()
  create(@Body() dto: CreateOrderDto, @Query('workspaceId') workspaceId?: string) {
    const wsId = dto.workspaceId ?? (workspaceId ? +workspaceId : 1);
    return this.ordersService.create(dto, wsId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.ordersService.updateStatus(+id, dto.status, workspaceId ? +workspaceId : undefined);
  }
}