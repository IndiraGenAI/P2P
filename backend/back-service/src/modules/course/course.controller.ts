import { Role } from '@core/guards/role.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Res,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { baseController } from 'src/core/baseController';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetCourseFilterDto } from './dto/filter-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseStatusDto } from './dto/update-status.dto';

@ApiHeader({
  name: 'userRoleId',
  description: 'Set User Role ID',
  required: true,
})
@ApiTags('Course')
@ApiBearerAuth()
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Role('COURSE_CREATE')
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    let userEmailId: string | null;
    if (req.headers.emailId) {
      userEmailId = req.headers.emailId as string;
    }
    const result = await this.courseService.createCourse(
      createCourseDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Course created successfully.',
    );
  }

  @Role(
    'COURSE_VIEW',
    'SUBCOURSE_VIEW',
    'PACKAGE_VIEW',
    'BATCH_VIEW',
    'ADMISSION_VIEW',
    'ADMISSION_CREATE',
    'USER_BATCH',
    'USER_VIEW',
    'UN_ASSIGN_BATCH_ADMISSION',
    'MY_TEAM_BATCHES_VIEW',
    'ADMISSION_CHEQUE_LIST_VIEW',
    'ADMISSION_OUTSTANDING_INCOME',
    'ADMISSION_OVERDUE_INCOME',
  )
  @Get()
  async findAll(
    @Query() filterDto: GetCourseFilterDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.branchIds) {
      filterDto.branchIds = req.headers.branchIds;
    }
    const result = await this.courseService.getCourseWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Courses Feathced Successfully.',
    );
  }

  @Role(
    'COURSE_VIEW',
    'SUBCOURSE_VIEW',
    'PACKAGE_VIEW',
    'BATCH_VIEW',
    'ADMISSION_VIEW',
    'ADMISSION_CREATE',
    'USER_BATCH',
  )
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.courseService.findOne(+id);
    return baseController.getResult(
      res,
      200,
      result,
      'Course fetched successfully.',
    );
  }

  @Role('COURSE_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    updateCourseDto.id = +id;
    let userEmailId: string | null;
    if (req.headers.emailId) {
      userEmailId = req.headers.emailId as string;
    }
    const result = await this.courseService.updateCourse(
      updateCourseDto,
      userEmailId,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Course updated successfully.',
    );
  }

  @Role('COURSE_DELETE')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const course = await this.courseService.remove(+id);
    return baseController.getResult(
      res,
      200,
      course,
      'Course deleted successfully.',
    );
  }

  @Role('COURSE_UPDATE')
  @Patch(':id/status')
  async updateCourseStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseStatusDto: UpdateCourseStatusDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    if (req.headers.emailId) {
      updateCourseStatusDto.updated_by = req.headers.emailId as string;
    }
    const result = await this.courseService.updateCourseStatus(
      id,
      updateCourseStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Course status updated successfully.',
    );
  }
}
