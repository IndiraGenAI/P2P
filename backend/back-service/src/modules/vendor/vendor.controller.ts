import { Role } from '@core/guards/role.guard';
import type { AuthenticatedRequest } from '@core/guards/role.guard';
import {
  BadRequestException,
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Response } from 'express';
import { baseController } from 'src/core/baseController';
import { editFileName, readCSV } from '@commons/helper';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { GetVendorFilterDto } from './dto/vendor-filter.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UpdateVendorStatusDto } from './dto/update-status.dto';
import {
  CreateVendorBankDetailDto,
  UpdateVendorBankDetailDto,
  UpdateVendorBankDetailStatusDto,
} from './dto/vendor-bank-detail.dto';
import {
  CreateVendorEntityDto,
  UpdateVendorEntityDto,
  UpdateVendorEntityStatusDto,
} from './dto/vendor-entity.dto';
import {
  CreateVendorCenterDto,
  UpdateVendorCenterDto,
  UpdateVendorCenterStatusDto,
} from './dto/vendor-center.dto';
import {
  CreateVendorDocumentDto,
  UpdateVendorDocumentDto,
  UpdateVendorDocumentStatusDto,
} from './dto/vendor-document.dto';
import {
  CreateVendorCategoryDto,
  GetVendorCategoryFilterDto,
  UpdateVendorCategoryDto,
  UpdateVendorCategoryStatusDto,
} from './dto/vendor-category.dto';
import {
  CreateVendorSiteDto,
  GetVendorSiteFilterDto,
  UpdateVendorSiteDto,
  UpdateVendorSiteStatusDto,
} from './dto/vendor-site.dto';

@ApiTags('Vendor')
@ApiBearerAuth()
@Controller('vendor')
export class VendorController {
  constructor(private readonly service: VendorService) {}

  // =====================================================================
  // VENDOR CATEGORY (declared BEFORE /:id to avoid ParseIntPipe conflicts)
  // =====================================================================
  @Role('MASTER_VENDOR_CATEGORY_CREATE')
  @Post('category')
  async createCategory(
    @Body() data: CreateVendorCategoryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createVendorCategory(
      data,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Vendor category created successfully',
    );
  }

  @Role('MASTER_VENDOR_CATEGORY_VIEW')
  @Get('category')
  async findAllCategories(
    @Query() filterDto: GetVendorCategoryFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllCategoriesWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor categories fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_CATEGORY_VIEW')
  @Get('category/:id')
  async findOneCategory(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findOneCategory(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor category fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_CATEGORY_UPDATE')
  @Put('category/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateVendorCategoryDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateVendorCategory(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor category updated successfully',
    );
  }

  @Role('MASTER_VENDOR_CATEGORY_UPDATE')
  @Patch('category/:id/status')
  async updateCategoryStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateVendorCategoryStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateCategoryStatus(
      id,
      updateStatusDto,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor category status updated successfully',
    );
  }

  @Role('MASTER_VENDOR_CATEGORY_DELETE')
  @Delete('category/:id')
  async removeCategory(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeCategory(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor category deleted successfully',
    );
  }

  // =====================================================================
  // VENDOR SITE (declared BEFORE /:id to avoid ParseIntPipe conflicts)
  // =====================================================================
  @Role('MASTER_VENDOR_SITE_CREATE')
  @Post('site')
  async createSite(
    @Body() data: CreateVendorSiteDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createVendorSite(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Vendor site created successfully',
    );
  }

  @Role(
    'MASTER_VENDOR_SITE_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
  @Get('site')
  async findAllSites(
    @Query() filterDto: GetVendorSiteFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAllSitesWithFilter(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor sites fetched successfully',
    );
  }

  @Role(
    'MASTER_VENDOR_SITE_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
  @Get('site/:id')
  async findOneSite(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findOneSite(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor site fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_SITE_UPDATE')
  @Put('site/:id')
  async updateSite(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateVendorSiteDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateVendorSite(
      id,
      updateDto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor site updated successfully',
    );
  }

  @Role('MASTER_VENDOR_SITE_UPDATE')
  @Patch('site/:id/status')
  async updateSiteStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateVendorSiteStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateSiteStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor site status updated successfully',
    );
  }

  @Role('MASTER_VENDOR_SITE_DELETE')
  @Delete('site/:id')
  async removeSite(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeSite(id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor site deleted successfully',
    );
  }

  // =====================================================================
  // VENDOR BULK UPLOAD (declared BEFORE /:id to avoid ParseIntPipe conflicts)
  // =====================================================================
  @Role('MASTER_VENDOR_CREATE')
  @Get('bulk-upload/sample')
  async getBulkSampleHeaders(@Res() res: Response): Promise<Response> {
    const headers = this.service.getCsvHeaders();
    return baseController.getResult(
      res,
      200,
      { headers },
      'Vendor bulk-upload sample headers fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_CREATE')
  @Post('bulk-upload')
  @ApiOperation({ summary: 'Bulk upload vendors from a CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async bulkUpload(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }
    try {
      const csvData = await readCSV(file.path);
      const result = await this.service.bulkUploadFromCSV(
        csvData,
        req.user.email,
      );
      return baseController.getResult(
        res,
        200,
        result,
        `Vendor bulk upload completed: ${result.successCount} created, ${result.failureCount} failed`,
      );
    } finally {
      try {
        if (file?.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch {
        // ignore cleanup errors
      }
    }
  }

  // =====================================================================
  // VENDOR (master)
  // =====================================================================
  @Role('MASTER_VENDOR_CREATE')
  @Post()
  async create(
    @Body() data: CreateVendorDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.create(data, req.user.email);
    return baseController.getResult(
      res,
      201,
      result,
      'Vendor created successfully',
    );
  }

  @Role(
    'MASTER_VENDOR_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
  @Get()
  async findAll(
    @Query() filterDto: GetVendorFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findAll(filterDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendors fetched successfully',
    );
  }

  @Role(
    'MASTER_VENDOR_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_CREATE',
    'PROCUREMENT_PURCHASE_REQUEST_VIEW',
    'PROCUREMENT_PURCHASE_REQUEST_UPDATE',
  )
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
      'Vendor fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateVendorDto,
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
      'Vendor updated successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateVendorStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    updateStatusDto.updated_by = req.user.email;
    const result = await this.service.updateStatus(id, updateStatusDto);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor status updated successfully',
    );
  }

  @Role('MASTER_VENDOR_DELETE')
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
      'Vendor deleted successfully',
    );
  }

  // ==================== VENDOR BANK DETAILS ====================
  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/bank-details')
  async listBankDetails(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.listBankDetails(vendorId);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor bank details fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/bank-details/:id')
  async findBankDetail(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findBankDetail(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor bank detail fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_CREATE')
  @Post(':vendorId/bank-details')
  async createBankDetail(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() dto: CreateVendorBankDetailDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createBankDetail(
      vendorId,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Vendor bank detail created successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Put(':vendorId/bank-details/:id')
  async updateBankDetail(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorBankDetailDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateBankDetail(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor bank detail updated successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Patch(':vendorId/bank-details/:id/status')
  async updateBankDetailStatus(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorBankDetailStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateBankDetailStatus(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor bank detail status updated successfully',
    );
  }

  @Role('MASTER_VENDOR_DELETE')
  @Delete(':vendorId/bank-details/:id')
  async removeBankDetail(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeBankDetail(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor bank detail deleted successfully',
    );
  }

  // ==================== VENDOR ENTITIES ====================
  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/entities')
  async listEntities(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.listEntities(vendorId);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor entity mappings fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/entities/:id')
  async findEntityMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findEntityMapping(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor entity mapping fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_CREATE')
  @Post(':vendorId/entities')
  async createEntityMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() dto: CreateVendorEntityDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createEntityMapping(
      vendorId,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Vendor entity mapping created successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Put(':vendorId/entities/:id')
  async updateEntityMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorEntityDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateEntityMapping(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor entity mapping updated successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Patch(':vendorId/entities/:id/status')
  async updateEntityMappingStatus(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorEntityStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateEntityMappingStatus(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor entity mapping status updated successfully',
    );
  }

  @Role('MASTER_VENDOR_DELETE')
  @Delete(':vendorId/entities/:id')
  async removeEntityMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeEntityMapping(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor entity mapping deleted successfully',
    );
  }

  // ==================== VENDOR CENTERS ====================
  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/centers')
  async listCenters(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.listCenters(vendorId);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor center mappings fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/centers/:id')
  async findCenterMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findCenterMapping(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor center mapping fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_CREATE')
  @Post(':vendorId/centers')
  async createCenterMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() dto: CreateVendorCenterDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createCenterMapping(
      vendorId,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Vendor center mapping created successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Put(':vendorId/centers/:id')
  async updateCenterMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorCenterDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateCenterMapping(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor center mapping updated successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Patch(':vendorId/centers/:id/status')
  async updateCenterMappingStatus(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorCenterStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateCenterMappingStatus(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor center mapping status updated successfully',
    );
  }

  @Role('MASTER_VENDOR_DELETE')
  @Delete(':vendorId/centers/:id')
  async removeCenterMapping(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeCenterMapping(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor center mapping deleted successfully',
    );
  }

  // ==================== VENDOR DOCUMENTS ====================
  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/documents')
  async listDocuments(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.listDocuments(vendorId);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor documents fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_VIEW')
  @Get(':vendorId/documents/:id')
  async findDocument(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.findDocument(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor document fetched successfully',
    );
  }

  @Role('MASTER_VENDOR_CREATE')
  @Post(':vendorId/documents')
  async createDocument(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Body() dto: CreateVendorDocumentDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.createDocument(
      vendorId,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      201,
      result,
      'Vendor document created successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Put(':vendorId/documents/:id')
  async updateDocument(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorDocumentDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateDocument(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor document updated successfully',
    );
  }

  @Role('MASTER_VENDOR_UPDATE')
  @Patch(':vendorId/documents/:id/status')
  async updateDocumentStatus(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVendorDocumentStatusDto,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): Promise<Response> {
    const result = await this.service.updateDocumentStatus(
      vendorId,
      id,
      dto,
      req.user.email,
    );
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor document status updated successfully',
    );
  }

  @Role('MASTER_VENDOR_DELETE')
  @Delete(':vendorId/documents/:id')
  async removeDocument(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.service.removeDocument(vendorId, id);
    return baseController.getResult(
      res,
      200,
      result,
      'Vendor document deleted successfully',
    );
  }
}
