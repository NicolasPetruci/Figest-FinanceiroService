import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { AccountsModule } from './accounts/accounts.module';
import { BudgetsModule } from './budgets/budgets.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TransactionsModule, CategoriesModule, AccountsModule, BudgetsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
