import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Not, Repository } from 'typeorm';
import { PageMetaDto } from '@common/dtos/page-meta.dto';
import { PageDto } from '@common/dtos/page.dto';
import {
  CreateInventoryDto,
  GetInventoryDto,
  GetInventoriesDto,
  UpdateInventoryDto,
  GetInventoryByEanDto
} from './dtos/inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { DateTime } from 'luxon';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>
  ) {}

  async findProductWithAlert(
    queryParams: GetInventoriesDto
  ): Promise<PageDto<Inventory>> {
    const { order, take, page } = queryParams;
    const [data, itemCount] = await this.inventoryRepository.findAndCount({
      where: { state: Not('En buen estado') },
      order: { id: order },
      skip: (page - 1) * take,
      take: take
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: queryParams
    });

    return {
      data: data,
      meta: pageMetaDto
    };
  }

  async find(queryParams: GetInventoriesDto): Promise<PageDto<Inventory>> {
    const { order, take, page } = queryParams;
    const [data, itemCount] = await this.inventoryRepository.findAndCount({
      order: { id: order },
      skip: (page - 1) * take,
      take: take
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: queryParams
    });

    return {
      data: data,
      meta: pageMetaDto
    };
  }

  async findOne({ id }: GetInventoryDto): Promise<Inventory> {
    const data: Inventory = await this.inventoryRepository.findOne({
      where: { id }
    });

    if (!data) {
      throw new NotFoundException('Inventory data not found');
    }
    return data;
  }

  async findByEan({ ean }: GetInventoryByEanDto): Promise<Inventory> {
    const data: Inventory = await this.inventoryRepository.findOne({
      where: { ean }
    });

    if (!data) {
      throw new NotFoundException('Inventory data not found');
    }

    return data;
  }

  async create(payload: CreateInventoryDto) {
    const product = await this.inventoryRepository.findOne({
      where: { ean: payload.ean }
    });

    if (product) {
      throw new BadRequestException('Product already exists');
    }

    const newData: Inventory = this.inventoryRepository.create(payload);
    const { daysBeforeRemove, expiresIn } = newData;
    let removeDate = DateTime.fromJSDate(expiresIn);
    removeDate = removeDate.minus({ days: daysBeforeRemove });
    newData.removeDate = removeDate.toJSDate();
    const now = DateTime.fromISO(new Date().toISOString());
    const leftDaysToRemove = now.diff(removeDate, 'days').days;
    console.log(leftDaysToRemove);

    if (leftDaysToRemove <= daysBeforeRemove) {
      if (leftDaysToRemove < 0) {
        newData.state = 'Caducado';
      } else {
        newData.state = 'A punto de caducar';
      }
    } else {
      newData.state = 'En buen estado';
    }
    return await this.inventoryRepository.save(newData);
  }

  async update(
    params: GetInventoryDto,
    payload: UpdateInventoryDto
  ): Promise<Inventory> {
    const data: Inventory = await this.findOne(params);

    const uptatedData = this.inventoryRepository.merge(data, payload);

    return await this.inventoryRepository.save(uptatedData);
  }

  async delete(params: GetInventoryDto): Promise<DeleteResult> {
    const data: Inventory = await this.findOne(params);

    return await this.inventoryRepository.delete({ id: data.id });
  }
}
