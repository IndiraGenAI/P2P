import { Role } from '@core/guards/role.guard';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import {
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { baseController } from 'src/core/baseController';
import { TermsConditionService } from './terms-condition.service';
import { CreateTermsConditionDto } from './dto/create-terms-condition.dto';
import { GetTermsConditionFilterDto } from './dto/terms-condition-filter.dto';
import { UpdateTermsConditionDto } from './dto/update-terms-condition.dto';
import { UpdateTermsConditionStatusDto } from './dto/update-status.dto';

@ApiTags('Terms & Condition')
@ApiBearerAuth()
@Controller('terms-condition')
export class TermsConditionController {
  constructor(private readonly service: TermsConditionService) {}

  @Role('MASTER_TERMS_CONDITIONS_CREATE')
  @Post()
  async create(
    @Body() data: CreateTermsConditionDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Terms & condition created successfully',
    );
  }

  @Role('MASTER_TERMS_CONDITIONS_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetTermsConditionFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Terms & conditions fetched successfully',
    );
  }

  @Role('MASTER_TERMS_CONDITIONS_VIEW')
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
      'Terms & condition fetched successfully',
    );
  }

  @Role('MASTER_TERMS_CONDITIONS_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTermsConditionDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.update(id, updateDto, req.user.email);
    return baseController.getResult(
      res,
      200,
      result,
      'Terms & condition updated successfully',
    );
  }

  @Role('MASTER_TERMS_CONDITIONS_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateTermsConditionStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Terms & condition status updated successfully',
    );
  }

  @Role('MASTER_TERMS_CONDITIONS_DELETE')
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
      'Terms & condition deleted successfully',
    );
  }
}
