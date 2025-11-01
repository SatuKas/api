import { Module } from '@nestjs/common';
import { CoaService } from 'src/modules/coa/services/coa.service';
import { CoaController } from 'src/modules/coa/coa.controller';
import { BookModule } from '../book/book.module';
@Module({
  imports: [BookModule],
  providers: [CoaService],
  controllers: [CoaController],
  exports: [CoaService],
})
export class CoaModule {}
