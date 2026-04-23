import { Module } from '@nestjs/common';
import { CoaCategoryController } from './coa-category.controller';
import { CoaCategoryService } from './coa-category.service';

@Module({
  controllers: [CoaCategoryController],
  providers: [CoaCategoryService],
  exports: [CoaCategoryService],
})
export class CoaCategoryModule {}
