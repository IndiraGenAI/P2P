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

  @SkipAuth()
  @Post()
  async create(
    @Body() data: CreateCountryDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.countryService.createCountry(data, userEmailId);
    return baseController.getResult(
      res,
      201,
      result,
      'Country created successfully',
    );
  }

  @SkipAuth()
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

  @SkipAuth()
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

  @SkipAuth()
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryDto: UpdateCountryDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    const userEmailId = (req.headers.emailId as string) || null;
    const result = await this.countryService.updateCountry(
      id,
      updateCountryDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Country updated successfully',
    );
  }

  @SkipAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryStatusDto: UpdateCountryStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateCountryStatusDto.updated_by = req.headers.emailId as string;
    }
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

  @SkipAuth()
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
