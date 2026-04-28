import { Module } from '@nestjs/common';
import { ApplicantTypeController } from './applicant-type.controller';
import { ApplicantTypeService } from './applicant-type.service';

@Module({
  controllers: [ApplicantTypeController],
  providers: [ApplicantTypeService],
  exports: [ApplicantTypeService],
})
export class ApplicantTypeModule {}
