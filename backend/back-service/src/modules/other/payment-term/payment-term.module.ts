import { Module } from '@nestjs/common';
import { PaymentTermController } from './payment-term.controller';
import { PaymentTermService } from './payment-term.service';

@Module({
  controllers: [PaymentTermController],
  providers: [PaymentTermService],
  exports: [PaymentTermService],
})
export class PaymentTermModule {}
