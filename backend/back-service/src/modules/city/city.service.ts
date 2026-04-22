import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { City } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { GetCityFilterDto } from './dto/city-filter.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { UpdateCityStatusDto } from './dto/update-status.dto';
import { CityRepository } from './city.repository';

interface CityListResponse {
  rows: City[];
  count: number;
}

@Injectable()
export class CityService {
  async createCity(
    createCityDto: CreateCityDto,
    userEmailId: string | null,
  ): Promise<City> {
    const name = createCityDto.name?.trim();
    if (!name) {
      throw new ConflictException('City name is required');
    }
    if (!createCityDto.country_id) {
      throw new ConflictException('Country is required');
    }
    if (!createCityDto.state_id) {
      throw new ConflictException('State is required');
    }

    const existing = await CityRepository.createQueryBuilder('city')
      .where('LOWER(city.name) = LOWER(:name)', { name })
      .andWhere('city.state_id = :state_id', {
        state_id: createCityDto.state_id,
      })
      .getOne();
    if (existing) {
      throw new ConflictException(
        `City "${name}" already exists for this state`,
      );
    }

    const city = CityRepository.create({
      ...createCityDto,
      name,
      status: createCityDto.status ?? true,
      created_by: userEmailId ?? createCityDto.created_by ?? null,
      created_date: new Date(),
    });

    return CityRepository.save(city);
  }

  async findAllWithFilter(
    filterDto: GetCityFilterDto,
  ): Promise<PageDto<City> | CityListResponse> {
    const { name, country_id, state_id, status, orderBy, order } = filterDto;

    const query = CityRepository.createQueryBuilder('city')
      .leftJoinAndSelect('city.country', 'country')
      .leftJoinAndSelect('city.state', 'state');

    if (name) {
      query.andWhere('LOWER(city.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (country_id) {
      query.andWhere('city.country_id = :country_id', { country_id });
    }

    if (state_id) {
      query.andWhere('city.state_id = :state_id', { state_id });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('city.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`city.${sortColumn}`, order);

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

  async findOne(id: number): Promise<City> {
    const city = await CityRepository.findOne({
      where: { id },
      relations: { country: true, state: true },
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async updateCity(
    id: number,
    updateCityDto: UpdateCityDto,
    userEmailId: string | null,
  ): Promise<City> {
    const city = await CityRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException('City not found');
    }

    const nextName = updateCityDto.name?.trim() ?? city.name;
    const nextStateId = updateCityDto.state_id ?? city.state_id;

    if (nextName !== city.name || nextStateId !== city.state_id) {
      const conflict = await CityRepository.createQueryBuilder('city')
        .where('LOWER(city.name) = LOWER(:name)', { name: nextName })
        .andWhere('city.state_id = :state_id', { state_id: nextStateId })
        .getOne();
      if (conflict && conflict.id !== id) {
        throw new ConflictException(
          `City "${nextName}" already exists for this state`,
        );
      }
    }

    if (updateCityDto.name !== undefined) city.name = nextName;
    if (updateCityDto.country_id !== undefined) {
      city.country_id = updateCityDto.country_id;
    }
    if (updateCityDto.state_id !== undefined) city.state_id = nextStateId;
    if (updateCityDto.status !== undefined) city.status = updateCityDto.status;

    city.updated_by = userEmailId ?? updateCityDto.updated_by ?? null;
    city.updated_date = new Date();

    return CityRepository.save(city);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await CityRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('City not found');
  }

  async updateCityStatus(
    id: number,
    updateCityStatusDto: UpdateCityStatusDto,
  ): Promise<UpdateResult> {
    const result = await CityRepository.update(id, {
      ...updateCityStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('City not found');
  }
}
