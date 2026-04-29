import { Injectable, NotFoundException } from '@nestjs/common';
import { Area, Lookups } from 'erp-db';
import { areaRepository, cityRepository, ConfigurationsRepository, countryRepository, labelRemarksRepository, lookupRepository, paymentModeRepository, sourceRepository, stateRepository } from './repository/common.repository';
import { AddArea, AddressResponse } from './dto/address.interface';
import { getLookupType } from './dto/getLookupType.dto';
import { PreSignedURLParams } from './dto/presignurl-s3file-upload.dto';
import { getPreSignedURL } from "src/commons/helper";
import { SourceResponse } from './dto/source.interface.dto';
import { PaymentModeResponse } from './dto/payment-mode.interface.dto';
import { LabelRemarksResponse } from './dto/label-emarks.interface.dto';
import { In } from "typeorm";
import { Configurations } from "erp-db";

@Injectable()
export class CommonService {
  [x: string]: any;
  async getLookup(lookupType: getLookupType): Promise<Lookups[]> {
    return await lookupRepository.getLookUpByType(lookupType);
  }

  async findCountryStateCityArea(): Promise<AddressResponse> {
    const address = {} as AddressResponse;
    const [area, city, state, country] = await Promise.all([
      areaRepository.find({ select: ['id', 'name'] }),
      cityRepository.find({
        select: ['id', 'name', 'state_id', 'country_id', 'status'],
      }),
      stateRepository.find({
        select: ['id', 'name', 'country_id', 'status'],
      }),
      countryRepository.find({
        select: ['id', 'name', 'status'],
      }),
    ]);
    Object.assign(address, { country }, { state }, { city }, { area });
    return address;
  }

  async getPreSignedURL(
    params: PreSignedURLParams
  ): Promise<Record<string, unknown>> {
    return getPreSignedURL(
      params.file_name,
      params.mime_type,
      params.bucket_name,
      params.storage_path
    );
  }

  async getSource(): Promise<SourceResponse> {
    const result = await sourceRepository.getSource();
    return result;
  }

  async getPaymentMode(): Promise<PaymentModeResponse> {
    const result = await paymentModeRepository.getPaymentModeMode();
    return result;
  }

  async createArea(createAreaDto: AddArea): Promise<Area> {
    const result = await areaRepository.save(createAreaDto);
    return result;
  }

  async getLabelRemarks(): Promise<LabelRemarksResponse> {
    const result = await labelRemarksRepository.getLabelRemarks();
    return result;
  }

  async getConfigurationDetailsByCodes(codes: string[]): Promise<Configurations[]> {
    const result = await ConfigurationsRepository.find({ where: { code: In(codes) } })
    if (!result) {
      throw new NotFoundException('This record does not exist');
    }
    return result;
  }
}
