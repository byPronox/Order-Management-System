import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(
    @Query('workspaceId') workspaceId?: string,
    @Query('search') search?: string,
    @Query() pagination?: PaginationQueryDto,
  ) {
    return this.customersService.findAll({
      workspaceId: workspaceId ? +workspaceId : undefined,
      search,
      page: pagination?.page,
      limit: pagination?.limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.customersService.findOne(+id, workspaceId ? +workspaceId : undefined);
  }

  @Post()
  create(@Body() dto: CreateCustomerDto, @Query('workspaceId') workspaceId?: string) {
    return this.customersService.create(dto, workspaceId ? +workspaceId : 1);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.customersService.update(+id, dto, workspaceId ? +workspaceId : undefined);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.customersService.remove(+id, workspaceId ? +workspaceId : undefined);
  }
}