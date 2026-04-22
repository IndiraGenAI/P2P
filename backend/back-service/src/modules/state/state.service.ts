import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { State } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateStateDto } from './dto/create-state.dto';
import { GetStateFilterDto } from './dto/state-filter.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { UpdateStateStatusDto } from './dto/update-status.dto';
import { StateRepository } from './state.repository';

interface StateListResponse {
  rows: State[];
  count: number;
}

@Injectable()
export class StateService {
  async createState(
    createStateDto: CreateStateDto,
    userEmailId: string | null,
  ): Promise<State> {
    const name = createStateDto.name?.trim();
    if (!name) {
      throw new ConflictException('State name is required');
    }
    if (!createStateDto.country_id) {
      throw new ConflictException('Country is required');
    }

    const existing = await StateRepository.createQueryBuilder('state')
      .where('LOWER(state.name) = LOWER(:name)', { name })
      .andWhere('state.country_id = :country_id', {
        country_id: createStateDto.country_id,
      })
      .getOne();
    if (existing) {
      throw new ConflictException(
        `State "${name}" already exists for this country`,
      );
    }

    const state = StateRepository.create({
      ...createStateDto,
      name,
      status: createStateDto.status ?? true,
      created_by: userEmailId ?? createStateDto.created_by ?? null,
      created_date: new Date(),
    });

    return StateRepository.save(state);
  }

  async findAllWithFilter(
    filterDto: GetStateFilterDto,
  ): Promise<PageDto<State> | StateListResponse> {
    const { name, country_id, status, orderBy, order } = filterDto;

    const query = StateRepository.createQueryBuilder('state').leftJoinAndSelect(
      'state.country',
      'country',
    );

    if (name) {
      query.andWhere('LOWER(state.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (country_id) {
      query.andWhere('state.country_id = :country_id', { country_id });
    }

    if (status !== undefined && status !== null) {
      query.andWhere('state.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`state.${sortColumn}`, order);

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

  async findOne(id: number): Promise<State> {
    const state = await StateRepository.findOne({
      where: { id },
      relations: { country: true },
    });
    if (!state) {
      throw new NotFoundException('State not found');
    }
    return state;
  }

  async updateState(
    id: number,
    updateStateDto: UpdateStateDto,
    userEmailId: string | null,
  ): Promise<State> {
    const state = await StateRepository.findOne({ where: { id } });
    if (!state) {
      throw new NotFoundException('State not found');
    }

    const nextName = updateStateDto.name?.trim() ?? state.name;
    const nextCountryId = updateStateDto.country_id ?? state.country_id;

    if (
      nextName !== state.name ||
      nextCountryId !== state.country_id
    ) {
      const conflict = await StateRepository.createQueryBuilder('state')
        .where('LOWER(state.name) = LOWER(:name)', { name: nextName })
        .andWhere('state.country_id = :country_id', {
          country_id: nextCountryId,
        })
        .getOne();
      if (conflict && conflict.id !== id) {
        throw new ConflictException(
          `State "${nextName}" already exists for this country`,
        );
      }
    }

    if (updateStateDto.name !== undefined) state.name = nextName;
    if (updateStateDto.country_id !== undefined) {
      state.country_id = nextCountryId;
    }
    if (updateStateDto.status !== undefined) state.status = updateStateDto.status;

    state.updated_by = userEmailId ?? updateStateDto.updated_by ?? null;
    state.updated_date = new Date();

    return StateRepository.save(state);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await StateRepository.delete({ id });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('State not found');
  }

  async updateStateStatus(
    id: number,
    updateStateStatusDto: UpdateStateStatusDto,
  ): Promise<UpdateResult> {
    const result = await StateRepository.update(id, {
      ...updateStateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) {
      return result;
    }
    throw new NotFoundException('State not found');
  }
}
