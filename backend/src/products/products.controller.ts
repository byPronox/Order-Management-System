import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('workspaceId') workspaceId?: string,
    @Query('search') search?: string,
    @Query() pagination?: PaginationQueryDto,
  ) {
    return this.productsService.findAll({
      workspaceId: workspaceId ? +workspaceId : undefined,
      search,
      page: pagination?.page,
      limit: pagination?.limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.productsService.findOne(+id, workspaceId ? +workspaceId : undefined);
  }

  @Post()
  create(@Body() dto: CreateProductDto, @Query('workspaceId') workspaceId?: string) {
    return this.productsService.create(dto, workspaceId ? +workspaceId : 1);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.productsService.update(+id, dto, workspaceId ? +workspaceId : undefined);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('workspaceId') workspaceId?: string) {
    return this.productsService.remove(+id, workspaceId ? +workspaceId : undefined);
  }
}