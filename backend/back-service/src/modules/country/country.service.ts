import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Country } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { GetCountryFilterDto } from './dto/country-filter.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { UpdateCountryStatusDto } from './dto/update-status.dto';
import { CountryRepository } from './country.repository';

interface CountryListResponse {
  rows: Country[];
  count: number;
}

@Injectable()
export class CountryService {
  async createCountry(
    createCountryDto: CreateCountryDto,
    userEmailId: string | null,
  ): Promise<Country> {
    const name = createCountryDto.name?.trim();
    if (!name) {
      throw new ConflictException('Country name is required');
    }

    const existing = await CountryRepository.createQueryBuilder('country')
      .where('LOWER(country.name) = LOWER(:name)', { name })
      .getOne();
    if (existing) {
      throw new ConflictException(`Country "${name}" already exists`);
    }

    const country = CountryRepository.create({
      ...createCountryDto,
      name,
      status: createCountryDto.status ?? true,
      created_by: userEmailId ?? createCountryDto.created_by ?? null,
      created_date: new Date(),
    });

    return CountryRepository.save(country);
  }

  async findAllWithFilter(
    filterDto: GetCountryFilterDto,
  ): Promise<PageDto<Country> | CountryListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = CountryRepository.createQueryBuilder('country');

    if (name) {
      query.andWhere('LOWER(country.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('country.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`country.${sortColumn}`, order);

    if (String(filterDto.noLimit) === 'true') {
      const [rows, count] = await query.getManyAndCount();
      return { rows, count };
    }

    query.skip(filterDto.skip).take(filterDto.take);
    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();

    const pageOptionsDto: PageOptionsDto = {
      take: filterDto.take,
      createdDate: new Date(),
      order: filterDto.order,
      skip: filterDto.skip,
    } as PageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<Country> {
    const country = await CountryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return country;
  }

  async updateCountry(
    id: number,
    updateCountryDto: UpdateCountryDto,
    userEmailId: string | null,
  ): Promise<Country> {
    const country = await CountryRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException('Country not found');
    }

    if (
      updateCountryDto.name &&
      updateCountryDto.name.trim().toLowerCase() !==
        (country.name ?? '').toLowerCase()
    ) {
      const newName = updateCountryDto.name.trim();
      const conflict = await CountryRepository.createQueryBuilder('country')
        .where('LOWER(country.name) = LOWER(:name)', { name: newName })
        .getOne();
      if (conflict && conflict.id !== id) {
        throw new ConflictException(`Country "${newName}" already exists`);
      }
      country.name = newName;
    }

    if (updateCountryDto.status !== undefined) {
      country.status = updateCountryDto.status;
    }

    country.updated_by = userEmailId ?? updateCountryDto.updated_by ?? null;
    country.updated_date = new Date();

    return CountryRepository.save(country);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await CountryRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Country not found');
  }

  async updateCountryStatus(
    id: number,
    updateCountryStatusDto: UpdateCountryStatusDto,
  ): Promise<UpdateResult> {
    const result = await CountryRepository.update(id, {
      ...updateCountryStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('Country not found');
  }
}
