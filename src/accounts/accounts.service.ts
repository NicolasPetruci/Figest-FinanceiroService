import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async update(id: string, userId: string, data: UpdateAccountDto) {
    await this.findOne(id, userId); // Ensure exists and belongs to user
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.$transaction(async (tx) => {
      let fallbackAcc = await tx.account.findFirst({
        where: { userId, id: { not: id } },
      });

      if (!fallbackAcc) {
        fallbackAcc = await tx.account.create({
          data: {
            name: 'Conta Principal',
            bankName: 'Banco Geral',
            type: 'CHECKING',
            balance: 0,
            userId,
          },
        });
      }

      await tx.transaction.updateMany({
        where: { accountId: id },
        data: { accountId: fallbackAcc.id },
      });

      return tx.account.delete({
        where: { id },
      });
    });
  }
}
