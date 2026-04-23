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
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { GetCountryFilterDto } from './dto/country-filter.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { UpdateCountryStatusDto } from './dto/update-status.dto';

@ApiTags('Country')
@ApiBearerAuth()
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Role('MASTER_COUNTRY_CREATE')
  @Post()
  async create(
    @Body() data: CreateCountryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.countryService.createCountry(
      data,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Country created successfully',
    );
  }

  @Role('MASTER_COUNTRY_VIEW')
  @Get()
  async findAll(
    @Query() filterDto: GetCountryFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.countryService.findAllWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Countries fetched successfully',
    );
  }

  @Role('MASTER_COUNTRY_VIEW')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.countryService.findOne(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Country fetched successfully',
    );
  }

  @Role('MASTER_COUNTRY_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryDto: UpdateCountryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.countryService.updateCountry(
      id,
      updateCountryDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Country updated successfully',
    );
  }

  @Role('MASTER_COUNTRY_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryStatusDto: UpdateCountryStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateCountryStatusDto.updated_by = req.user.email;
    const result = await this.countryService.updateCountryStatus(
      id,
      updateCountryStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Country status updated successfully',
    );
  }

  @Role('MASTER_COUNTRY_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.countryService.remove(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Country deleted successfully',
    );
  }
}
