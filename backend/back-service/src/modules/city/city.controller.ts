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
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { GetCityFilterDto } from './dto/city-filter.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { UpdateCityStatusDto } from './dto/update-status.dto';

@ApiTags('City')
@ApiBearerAuth()
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Role('MASTER_CITY_CREATE')
  @Post()
  async create(
    @Body() data: CreateCityDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.cityService.createCity(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'City created successfully',
    );
  }

  @Role('MASTER_CITY_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetCityFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.cityService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Cities fetched successfully',
    );
  }

  @Role('MASTER_CITY_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.cityService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'City fetched successfully',
    );
  }

  @Role('MASTER_CITY_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.cityService.updateCity(
      id,
      updateCityDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'City updated successfully',
    );
  }

  @Role('MASTER_CITY_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityStatusDto: UpdateCityStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateCityStatusDto.updated_by = req.user.email;
    const result = await this.cityService.updateCityStatus(
      id,
      updateCityStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'City status updated successfully',
    );
  }

  @Role('MASTER_CITY_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.cityService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'City deleted successfully',
    );
  }
}
