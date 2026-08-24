import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UserId } from '../common/decorators/user-id.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@UserId() userId: string, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(userId, createAccountDto);
  }

  @Get()
  findAll(@UserId() userId: string) {
    return this.accountsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @UserId() userId: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, userId, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.accountsService.remove(id, userId);
  }
}
