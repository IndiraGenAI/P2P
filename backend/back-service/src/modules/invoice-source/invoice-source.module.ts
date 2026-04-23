import { Module } from '@nestjs/common';
import { InvoiceSourceController } from './invoice-source.controller';
import { InvoiceSourceService } from './invoice-source.service';

@Module({
  controllers: [InvoiceSourceController],
  providers: [InvoiceSourceService],
  exports: [InvoiceSourceService],
})
export class InvoiceSourceModule {}
