import { Module } from '@nestjs/common';
import { GrnInvoiceController } from './grn-invoice.controller';
import { GrnInvoiceService } from './grn-invoice.service';

@Module({
  controllers: [GrnInvoiceController],
  providers: [GrnInvoiceService],
  exports: [GrnInvoiceService],
})
export class GrnInvoiceModule {}
