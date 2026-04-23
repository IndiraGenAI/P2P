import { Controller, Get, Post, Body, Res, Req, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonService } from './common.service';
import { Response } from 'express';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import { getLookupType } from './dto/getLookupType.dto';
import { baseController } from '@core/baseController';
import { AddArea } from './dto/address.interface';
import { PreSignedURLParams } from './dto/presignurl-s3file-upload.dto';

@ApiTags('Common')
@ApiBearerAuth()
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/lookup')
  async getLookup(
    @Body() lookupType: getLookupType,
    @Res() res: Response,
  ) {
    const result = await this.commonService.getLookup(lookupType);
    return baseController.getResult(
      res,
      200,
      result,
      'Lookup fetched successfully.',
    );
  }

  @Get('/address')
  async getAddress(@Res() res: Response): Promise<Response> {
    const result = await this.commonService.findCountryStateCityArea();
    return baseController.getResult(
      res,
      200,
      result,
      'Address Fetched Successfully',
    );
  }

  @Get('/presigned-url')
  async getPreSignedURL(
    @Query() PreSignedURLParams: PreSignedURLParams,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.commonService.getPreSignedURL(PreSignedURLParams);
    return baseController.getResult(
      res,
      200,
      result,
      'S3 bucket file upload Successfully',
    );
  }

  @Get('/source')
  async getSource(@Res() res: Response): Promise<Response> {
    const result = await this.commonService.getSource();
    return baseController.getResult(
      res,
      200,
      result,
      'Source fetched Successfully.',
    );
  }

  @Get('/payment-mode')
  async getPaymentMode(@Res() res: Response): Promise<Response> {
    const result = await this.commonService.getPaymentMode();
    return baseController.getResult(
      res,
      200,
      result,
      'Payment-mode fetched Successfully.',
    );
  }

  @Post('/add-area')
  async create(
    @Body() createAreaDto: AddArea,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    createAreaDto.created_by = req.user.email;
    const result = await this.commonService.createArea(createAreaDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Area created successfully.',
    );
  }

  @Get('/label_remarks')
  async getLabelEMarks(@Res() res: Response): Promise<Response> {
    const result = await this.commonService.getLabelRemarks();
    return baseController.getResult(
      res,
      200,
      result,
      'Label-Remarks fetched Successfully.',
    );
  }

  @Post('/getConfigurationDetailsByCodes')
  async getconfiguration(
    @Body() data: string[],
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.commonService.getConfigurationDetailsByCodes(
      data,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Configurations fetched successfully',
    );
  }
}
