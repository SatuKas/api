import { Module } from '@nestjs/common';
import { TransactionService } from 'src/modules/transaction/services/transaction.service';
import { TransactionController } from 'src/modules/transaction/transaction.controller';
@Module({
  imports: [],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
