import { SkipAuth } from '@core/guards/role.guard';
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
import { Request, Response } from 'express';
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

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateCityDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.cityService.createCity(data, userEmailId);
    return baseController.getResult(
      res,
      201,
      result,
      'City created successfully',
    );
  }

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.cityService.updateCity(
      id,
      updateCityDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'City updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityStatusDto: UpdateCityStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateCityStatusDto.updated_by = req.headers.emailId as string;
    }
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

  @SkipAuth()
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
