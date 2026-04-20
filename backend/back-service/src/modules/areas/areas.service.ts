import { BadRequestException, Injectable } from '@nestjs/common';
import { Area } from 'erp-db';
import { PageDto } from 'src/general-dto/.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/-option.dto';
import { GetAreasFilterDto } from './dto/area-filter-dto';
import { AreaResponse } from './dto/area-interface.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UpdateAreaDto } from './dto/update-area.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { areasRepository } from './area-repository';
import { countryRepository } from '@modules/common/common.repository';
import { CountryName } from '@commons/enum';

@Injectable()
export class AreasService {
  async createArea(createAreasDto: CreateAreaDto): Promise<Area> {
    const countryData = await countryRepository.find({
      where: { name: CountryName.INDIA },
    });
    createAreasDto.country_id = countryData[0].id;
    const result = await areasRepository.save(createAreasDto);
    return result;
  }

  async findAllAreas(
    filterDto: GetAreasFilterDto,
  ): Promise<PageDto<Area> | AreaResponse> {
    const { city_id, name, pincode, state_id, status } = filterDto;
    let query = await areasRepository
      .createQueryBuilder('area')
      .leftJoinAndSelect('area.city', 'city')
      .leftJoinAndSelect('area.country', 'country')
      .leftJoinAndSelect('area.state', 'state');

    if (city_id) {
      query.andWhere(`area.city_id = :city_id`, { city_id: city_id });
    }
    if (name) {
      query.andWhere(`LOWER(area.name) LIKE LOWER(:name)`, { name: `${name}` });
    }

    if (pincode) {
      query.andWhere(`area.pincode = :pincode`, { pincode: pincode });
    }

    if (state_id) {
      query.andWhere(`area.state_id = :state_id`, { state_id: state_id });
    }

    if (status) {
      query.andWhere(`area.status = :status`, { status: status });
    }

    if (filterDto.orderBy) {
      query.orderBy(`area.${filterDto.orderBy}`, filterDto.order);
    } else {
      query.orderBy(`area.created_date`, filterDto.order);
    }
    if (String(filterDto.noLimit) === 'true') {
      let data = await query.getManyAndCount();
      const result = {
        rows: data[0],
        count: data[0].length,
      };
      return result;
    } else {
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
  }

  async findOne(id: number): Promise<AreaResponse | Area> {
    const result = await areasRepository.find({ where: { id } });
    if (!result[0]) {
      throw new BadRequestException(`This record does not exist`);
    }
    return result[0];
  }

  async update(
    id: number,
    updateAreaDto: UpdateAreaDto,
  ): Promise<UpdateResult> {
    const result = await areasRepository.update(id, updateAreaDto);
    if (result && (await result).affected > 0) {
      return result;
    } else {
      throw new BadRequestException(`This record does not exist!`);
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await areasRepository.delete(+id);
    if (result && (await result).affected > 0) {
      return result;
    } else {
      throw new NotFoundException(`This record does not exist!`);
    }
  }
}
