import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Currency } from 'erp-db';
import { PageDto } from 'src/general-dto/page.dto';
import { PageMetaDto } from 'src/general-dto/pagemeta.dto';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { GetCurrencyFilterDto } from './dto/currency-filter.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { UpdateCurrencyStatusDto } from './dto/update-status.dto';
import { CurrencyRepository } from './currency.repository';

interface CurrencyListResponse {
  rows: Currency[];
  count: number;
}

@Injectable()
export class CurrencyService {
  async createCurrency(
    createDto: CreateCurrencyDto,
    userEmailId: string | null,
  ): Promise<Currency> {
    const code = createDto.code?.trim();
    const name = createDto.name?.trim();
    const symbol = createDto.symbol?.trim() ?? null;
    if (!code) throw new ConflictException('Code is required');
    if (!name) throw new ConflictException('Name is required');

    const codeConflict = await CurrencyRepository.createQueryBuilder('c')
      .where('LOWER(c.code) = LOWER(:code)', { code })
      .getOne();
    if (codeConflict) {
      throw new ConflictException(`Currency code "${code}" already exists`);
    }

    const nameConflict = await CurrencyRepository.createQueryBuilder('c')
      .where('LOWER(c.name) = LOWER(:name)', { name })
      .getOne();
    if (nameConflict) {
      throw new ConflictException(`Currency name "${name}" already exists`);
    }

    const entity = CurrencyRepository.create({
      ...createDto,
      code,
      name,
      symbol,
      status: createDto.status ?? true,
      created_by: userEmailId ?? createDto.created_by ?? null,
      created_date: new Date(),
    });

    return CurrencyRepository.save(entity);
  }

  async findAllWithFilter(
    filterDto: GetCurrencyFilterDto,
  ): Promise<PageDto<Currency> | CurrencyListResponse> {
    const { name, status, orderBy, order } = filterDto;

    const query = CurrencyRepository.createQueryBuilder('c');

    if (name) {
      query.andWhere(
        '(LOWER(c.name) LIKE LOWER(:name) OR LOWER(c.code) LIKE LOWER(:name))',
        { name: `%${name}%` },
      );
    }

    if (status !== undefined && status !== null) {
      query.andWhere('c.status = :status', { status });
    }

    const sortColumn = orderBy ?? 'created_date';
    query.orderBy(`c.${sortColumn}`, order);

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

  async findOne(id: number): Promise<Currency> {
    const entity = await CurrencyRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Currency not found');
    return entity;
  }

  async updateCurrency(
    id: number,
    updateDto: UpdateCurrencyDto,
    userEmailId: string | null,
  ): Promise<Currency> {
    const entity = await CurrencyRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Currency not found');

    const nextCode = updateDto.code?.trim() ?? entity.code;
    const nextName = updateDto.name?.trim() ?? entity.name;
    const nextSymbol =
      updateDto.symbol === undefined
        ? entity.symbol
        : updateDto.symbol === null
          ? null
          : updateDto.symbol.trim();

    if (nextCode !== entity.code) {
      const codeConflict = await CurrencyRepository.createQueryBuilder('c')
        .where('LOWER(c.code) = LOWER(:code)', { code: nextCode })
        .andWhere('c.id != :id', { id })
        .getOne();
      if (codeConflict) {
        throw new ConflictException(
          `Currency code "${nextCode}" already exists`,
        );
      }
    }

    if (nextName !== entity.name) {
      const nameConflict = await CurrencyRepository.createQueryBuilder('c')
        .where('LOWER(c.name) = LOWER(:name)', { name: nextName })
        .andWhere('c.id != :id', { id })
        .getOne();
      if (nameConflict) {
        throw new ConflictException(
          `Currency name "${nextName}" already exists`,
        );
      }
    }

    if (updateDto.code !== undefined) entity.code = nextCode;
    if (updateDto.name !== undefined) entity.name = nextName;
    if (updateDto.symbol !== undefined) entity.symbol = nextSymbol;
    if (updateDto.status !== undefined) entity.status = updateDto.status;

    entity.updated_by = userEmailId ?? updateDto.updated_by ?? null;
    entity.updated_date = new Date();

    return CurrencyRepository.save(entity);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await CurrencyRepository.delete({ id });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Currency not found');
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateCurrencyStatusDto,
  ): Promise<UpdateResult> {
    const result = await CurrencyRepository.update(id, {
      ...updateStatusDto,
      updated_date: new Date(),
    });
    if (result?.affected && result.affected > 0) return result;
    throw new NotFoundException('Currency not found');
  }
}
