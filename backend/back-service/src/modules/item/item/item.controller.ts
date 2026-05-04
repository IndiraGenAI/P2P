import { Role } from '@core/guards/role.guard';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as fs from 'fs';
import { baseController } from 'src/core/baseController';
import { editFileName, readCSV } from '@commons/helper';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemFilterDto } from './dto/item-filter.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateItemStatusDto } from './dto/update-status.dto';

@ApiTags('Item')
@ApiBearerAuth()
@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Role('MASTER_ITEM_CREATE')
  @Post()
  async create(
    @Body() data: CreateItemDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Item created successfully',
    );
  }

  @Role(
    'MASTER_ITEM_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
  @Get()
  async findAll(
    @Query() filterDto: GetItemFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Items fetched successfully',
    );
  }

  @Role(
    'MASTER_ITEM_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Item fetched successfully',
    );
  }

  @Role('MASTER_ITEM_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateItemDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Item updated successfully',
    );
  }

  @Role('MASTER_ITEM_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateItemStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Item status updated successfully',
    );
  }

  @Role('MASTER_ITEM_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Item deleted successfully',
    );
  }

  @Role('MASTER_ITEM_CREATE')
  @Get('bulk-upload/sample')
  async getBulkSampleHeaders(@Res() res: Response): Promise<Response> {
    const headers = this.service.getCsvHeaders();
    return baseController.getResult(
      res,
      200,
      { headers },
      'Item bulk-upload sample headers fetched successfully',
    );
  }

  @Role('MASTER_ITEM_CREATE')
  @Post('bulk-upload')
  @ApiOperation({ summary: 'Upload a CSV File' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async uploadFile(
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }
    const csvFileData = await readCSV(file.path);
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    const result = await this.service.createItemByUploadCSV(
      csvFileData,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Item is created successfully ',
    );
  }
}
