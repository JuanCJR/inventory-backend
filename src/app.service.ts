import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>
  ) {}

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

  async create(payload: CreateInventoryDto): Promise<Inventory> {
    const newData: Inventory = this.inventoryRepository.create(payload);

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
