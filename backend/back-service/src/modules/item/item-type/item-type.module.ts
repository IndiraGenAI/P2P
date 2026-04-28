import { Module } from '@nestjs/common';
import { ItemTypeController } from './item-type.controller';
import { ItemTypeService } from './item-type.service';

@Module({
  controllers: [ItemTypeController],
  providers: [ItemTypeService],
  exports: [ItemTypeService],
})
export class ItemTypeModule {}
