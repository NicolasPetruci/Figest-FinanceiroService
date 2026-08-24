import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserId } from '../common/decorators/user-id.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@UserId() userId: string, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  findAll(@UserId() userId: string) {
    return this.categoriesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.categoriesService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @UserId() userId: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, userId, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.categoriesService.remove(id, userId);
  }
}
