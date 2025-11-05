import { Module } from '@nestjs/common';
import { TransactionService } from 'src/modules/transaction/services/transaction.service';
import { TransactionController } from 'src/modules/transaction/transaction.controller';
import { BookModule } from '../book/book.module';
@Module({
  imports: [BookModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
