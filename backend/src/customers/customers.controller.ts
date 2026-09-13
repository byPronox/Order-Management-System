import { Controller, Get, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query('workspaceId') workspaceId?: string, @Query('search') search?: string) {
    return this.customersService.findAll(workspaceId ? +workspaceId : undefined, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.customersService.findOne(+id, workspaceId ? +workspaceId : undefined);
  }
}