import { baseController } from '@core/baseController';
import { Role } from '@core/guards/role.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Query,
  Put,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AreasService } from './areas.service';
import { GetAreasFilterDto } from './dto/area-filter-dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
@ApiHeader({
  name: 'userRoleId',
  description: 'Set User Role ID',
  required: true,
})
@ApiTags('Areas')
@ApiBearerAuth()
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @Role('AREA_CREATE')
  async create(
    @Body() createAreaDto: CreateAreaDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      createAreaDto.created_by = req.headers.emailId as string;
    }
    const result = await this.areasService.createArea(createAreaDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Area create successfully.',
    );
  }

  @Get()
  @Role('AREA_VIEW')
  async findAll(
    @Query() filterDto: GetAreasFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.areasService.findAllAreas(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Area fetch successfully.',
    );
  }

  @Get(':id')
  @Role('AREA_VIEW')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.areasService.findOne(+id);
    return baseController.getResult(
      res,
      200,
      result,
      'Area fetch successfully.',
    );
  }

  @Put(':id')
  @Role('AREA_UPDATE')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    updateAreaDto.id = +id;
    if (req.headers.emailId) {
      updateAreaDto.updated_by = req.headers.emailId as string;
    }
    const result = await this.areasService.update(id, updateAreaDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Area update successfully.',
    );
  }

  @Delete(':id')
  @Role('AREA_DELETE')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.areasService.remove(+id);
    return baseController.getResult(
      res,
      200,
      result,
      'Area delete successfully',
    );
  }
}
