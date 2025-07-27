import { Module } from '@nestjs/common';
import { BookService } from 'src/modules/book/services/book.service';
import { BookController } from 'src/modules/book/book.controller';

@Module({
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
