import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { baseController } from '@core/baseController';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';
import { GetPackageFilterDto } from './dto/filter-package.dto';
import { GetMultipleBranchWiseCommonCourse } from './dto/branch-department-course.dto';
import { Role } from '@core/guards/role.guard';
@ApiHeader({
  name: 'userRoleId',
  description: 'Set User Role ID',
  required: true,
})
@ApiTags('Package')
@ApiBearerAuth()
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('/common-course')
  async getBranchAndDepartmentWiseCourse(
    @Query() filterDto: GetMultipleBranchWiseCommonCourse,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.packagesService.getBranchWiseCommonCourse(
      filterDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Common courses fetched successfully.',
    );
  }

  @Role('PACKAGE_CREATE')
  @Post()
  async create(
    @Body() createPackageDto: CreatePackageDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    let userEmailId: string | null;
    if (req.headers.emailId) {
      userEmailId = req.headers.emailId as string;
    }
    const result = await this.packagesService.createPackages(
      createPackageDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Package created successfully',
    );
  }

  @Role(
    'PACKAGE_VIEW',
    'ADMISSION_VIEW',
    'ADMISSION_OVERDUE_INCOME',
    'ADMISSION_CREATE',
    'UN_ASSIGN_BATCH_ADMISSION',
    'ADMISSION_OUTSTANDING_INCOME',
  )
  @Get()
  async findAll(
    @Query() filterDto: GetPackageFilterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.branchIds) {
      filterDto.branchIds = req.headers.branchIds;
    }
    const result = await this.packagesService.getPackageWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Package fetched Successfully.',
    );
  }

  @Role(
    'PACKAGE_VIEW',
    'ADMISSION_VIEW',
    'ADMISSION_OVERDUE_INCOME',
    'ADMISSION_CREATE',
  )
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.packagesService.findOne(+id);
    return baseController.getResult(
      res,
      200,
      result,
      'Package fetched successfully.',
    );
  }

  @Role('PACKAGE_UPDATE')
  @Patch(':id/status')
  async updatePackageStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageStatusDto: UpdatePackageStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updatePackageStatusDto.updated_by = req.headers.emailId as string;
    }
    const result = await this.packagesService.updatePackageStatus(
      id,
      updatePackageStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Package Status Updated Successfully',
    );
  }

  @Role('PACKAGE_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const course = await this.packagesService.remove(+id);
    return baseController.getResult(
      res,
      200,
      course,
      'Package deleted successfully.',
    );
  }

  @Role('PACKAGE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageDto: UpdatePackageDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    updatePackageDto.id = +id;
    let userEmailId: string | null;
    if (req.headers.emailId) {
      userEmailId = req.headers.emailId as string;
    }
    const result = await this.packagesService.updatePackage(
      updatePackageDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Package updated successfully.',
    );
  }
}
