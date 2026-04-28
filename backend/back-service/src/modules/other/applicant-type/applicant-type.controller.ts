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
import { ApplicantTypeService } from './applicant-type.service';
import { CreateApplicantTypeDto } from './dto/create-applicant-type.dto';
import { GetApplicantTypeFilterDto } from './dto/applicant-type-filter.dto';
import { UpdateApplicantTypeDto } from './dto/update-applicant-type.dto';
import { UpdateApplicantTypeStatusDto } from './dto/update-status.dto';

@ApiTags('Applicant Type')
@ApiBearerAuth()
@Controller('applicant-type')
export class ApplicantTypeController {
  constructor(private readonly service: ApplicantTypeService) {}

  @Role('MASTER_APPLICANT_TYPE_CREATE')
  @Post()
  async create(
    @Body() data: CreateApplicantTypeDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Applicant type created successfully',
    );
  }

  @Role('MASTER_APPLICANT_TYPE_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetApplicantTypeFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Applicant types fetched successfully',
    );
  }

  @Role('MASTER_APPLICANT_TYPE_VIEW')
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
      'Applicant type fetched successfully',
    );
  }

  @Role('MASTER_APPLICANT_TYPE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateApplicantTypeDto,
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
      'Applicant type updated successfully',
    );
  }

  @Role('MASTER_APPLICANT_TYPE_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateApplicantTypeStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Applicant type status updated successfully',
    );
  }

  @Role('MASTER_APPLICANT_TYPE_DELETE')
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
      'Applicant type deleted successfully',
    );
  }
}
