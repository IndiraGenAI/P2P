import { Module } from '@nestjs/common';
import { SubdepartmentController } from './subdepartment.controller';
import { SubdepartmentService } from './subdepartment.service';

@Module({
  controllers: [SubdepartmentController],
  providers: [SubdepartmentService],
  exports: [SubdepartmentService],
})
export class SubdepartmentModule {}
