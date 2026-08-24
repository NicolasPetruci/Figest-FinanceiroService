import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { id: data.accountId, userId },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const transaction = await tx.transaction.create({
        data: {
          ...data,
          date: new Date(data.date),
          userId,
        },
      });

      const adjustment = data.type === 'INCOME' ? data.amount : -data.amount;
      await tx.account.update({
        where: { id: account.id },
        data: {
          balance: {
            increment: adjustment,
          },
        },
      });

      return transaction;
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true, account: true },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async update(id: string, userId: string, data: UpdateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const oldTx = await tx.transaction.findFirst({
        where: { id, userId },
      });
      if (!oldTx) {
        throw new NotFoundException('Transaction not found');
      }

      // Revert old transaction effect
      const oldAdjustment = oldTx.type === 'INCOME' ? -Number(oldTx.amount) : Number(oldTx.amount);
      await tx.account.update({
        where: { id: oldTx.accountId },
        data: { balance: { increment: oldAdjustment } },
      });

      const updatedTx = await tx.transaction.update({
        where: { id },
        data: {
          ...data,
          date: (data as any).date ? new Date((data as any).date) : undefined,
        },
      });

      // Apply new transaction effect
      const newAdjustment = updatedTx.type === 'INCOME' ? Number(updatedTx.amount) : -Number(updatedTx.amount);
      await tx.account.update({
        where: { id: updatedTx.accountId },
        data: { balance: { increment: newAdjustment } },
      });

      return updatedTx;
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: { id, userId },
      });
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Revert transaction effect
      const revertAdjustment = transaction.type === 'INCOME' ? -Number(transaction.amount) : Number(transaction.amount);
      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: revertAdjustment } },
      });

      return tx.transaction.delete({
        where: { id },
      });
    });
  }

  async getSummary(userId: string, month: number, year: number) {
    if (!month || !year) {
      throw new BadRequestException('Month and year are required');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const expensesByCategory: Record<string, number> = {};

    transactions.forEach(tx => {
      const amount = Number(tx.amount);
      if (tx.type === 'INCOME') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        const catName = tx.category.name;
        expensesByCategory[catName] = (expensesByCategory[catName] || 0) + amount;
      }
    });

    const accounts = await this.prisma.account.findMany({
      where: { userId },
    });
    const balance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

    return {
      totalIncome,
      totalExpense,
      balance,
      expensesByCategory,
    };
  }
}
