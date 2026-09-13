import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('workspaceId') workspaceId?: string, @Query('search') search?: string) {
    return this.productsService.findAll(workspaceId ? +workspaceId : undefined, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.productsService.findOne(+id, workspaceId ? +workspaceId : undefined);
  }
}