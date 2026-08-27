import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserId } from '../common/decorators/user-id.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@UserId() userId: string, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Post('bulk-update')
  bulkUpdate(
    @UserId() userId: string,
    @Body() body: { transactionIds: string[]; accountId?: string; categoryId?: string; subtag?: string },
  ) {
    return this.transactionsService.bulkUpdate(userId, body);
  }

  @Get('summary')
  getSummary(
    @UserId() userId: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('period') period?: string,
  ) {
    return this.transactionsService.getSummary(
      userId,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
      period || 'MONTHLY',
    );
  }

  @Get()
  findAll(
    @UserId() userId: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('accountId') accountId?: string,
    @Query('subtag') subtag?: string,
    @Query('period') period?: string,
  ) {
    return this.transactionsService.findAll(userId, {
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      accountId,
      subtag,
      period,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.transactionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @UserId() userId: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, userId, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.transactionsService.remove(id, userId);
  }
}
