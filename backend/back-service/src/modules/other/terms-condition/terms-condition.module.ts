import { Module } from '@nestjs/common';
import { TermsConditionController } from './terms-condition.controller';
import { TermsConditionService } from './terms-condition.service';

@Module({
  controllers: [TermsConditionController],
  providers: [TermsConditionService],
  exports: [TermsConditionService],
})
export class TermsConditionModule {}
