import { Module } from '@nestjs/common';
import { ReportService } from 'src/modules/report/services/report.service';
import { ReportController } from 'src/modules/report/report.controller';
import { BookModule } from '../book/book.module';
@Module({
  imports: [BookModule],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportService],
})
export class ReportModule {}
