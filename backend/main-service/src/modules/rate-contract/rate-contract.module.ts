import { Module } from '@nestjs/common';
import { RateContractController } from './rate-contract.controller';
import { RateContractService } from './rate-contract.service';

@Module({
  controllers: [RateContractController],
  providers: [RateContractService],
  exports: [RateContractService],
})
export class RateContractModule {}
