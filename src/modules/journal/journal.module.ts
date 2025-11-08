import { Module } from '@nestjs/common';
import { JournalService } from 'src/modules/journal/services/journal.service';
import { JournalController } from 'src/modules/journal/journal.controller';
import { BookModule } from '../book/book.module';
@Module({
  imports: [BookModule],
  providers: [JournalService],
  controllers: [JournalController],
  exports: [JournalService],
})
export class JournalModule {}
