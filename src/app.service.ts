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
import { Store } from './entities/store.entity';
import { User } from './entities/user.entity';
import {
  GetStoresDto,
  GetStoreDto,
  CreateStoreDto,
  UpdateStoreDto
} from './dtos/store.dto';
import {
  GetUsersDto,
  GetUserDto,
  CreateUserDto,
  UpdateUserDto,
  LoginDto
} from './dtos/user.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findProductWithAlert(
    queryParams: GetInventoriesDto
  ): Promise<PageDto<Inventory>> {
    const { order, take, page } = queryParams;
    const [data, itemCount] = await this.inventoryRepository.findAndCount({
      where: {
        state: Not('En buen estado'),
        store: { id: queryParams.store_id }
      },
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
      where: { store: { id: queryParams.store_id } },
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
      where: { ean: payload.ean, store: { id: payload.store_id } }
    });

    if (product) {
      throw new BadRequestException('Product already exists');
    }

    const store = await this.findOneStore({ id: payload.store_id });

    const newData: Inventory = this.inventoryRepository.create(payload);
    newData.store = store;

    const { daysBeforeRemove, expiresIn } = newData;
    let removeDate = DateTime.fromJSDate(expiresIn);
    removeDate = removeDate.minus({ days: daysBeforeRemove });
    newData.removeDate = removeDate.toJSDate();
    const now = DateTime.fromISO(new Date().toISOString());
    const leftDaysToRemove = removeDate.diff(now, 'days').days;

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

  ///Store Service

  async findStores(queryParams: GetStoresDto): Promise<PageDto<Store>> {
    const { order, take, page } = queryParams;
    const [data, itemCount] = await this.storeRepository.findAndCount({
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

  async findOneStore({ id }: GetStoreDto): Promise<Store> {
    const data: Store = await this.storeRepository.findOne({
      where: { id }
    });

    !data && new BadRequestException('Generic data not found');

    return data;
  }

  async createStore(payload: CreateStoreDto): Promise<Store> {
    const newData: Store = this.storeRepository.create(payload);

    return await this.storeRepository.save(newData);
  }

  async updateStore(
    params: GetStoreDto,
    payload: UpdateStoreDto
  ): Promise<Store> {
    const data: Store = await this.findOneStore(params);

    const uptatedData = this.storeRepository.merge(data, payload);

    return await this.storeRepository.save(uptatedData);
  }

  async deleteStore(params: GetStoreDto): Promise<DeleteResult> {
    const data: Store = await this.findOneStore(params);

    return await this.storeRepository.delete({ id: data.id });
  }

  /// User Service

  async findUser(queryParams: GetUsersDto): Promise<PageDto<User>> {
    const { order, take, page } = queryParams;
    const [data, itemCount] = await this.userRepository.findAndCount({
      order: { id: order },
      skip: (page - 1) * take,
      take: take,
      relations: ['store']
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

  async findOneUser({ id }: GetUserDto): Promise<User> {
    const data: User = await this.userRepository.findOne({
      where: { id },
      relations: ['store']
    });

    !data && new BadRequestException('Generic data not found');

    return data;
  }

  async createUser(payload: CreateUserDto): Promise<User> {
    const store = await this.findOneStore({ id: payload.store_id });

    const newData: User = this.userRepository.create(payload);
    newData.store = store;

    return await this.userRepository.save(newData);
  }

  async updateUser(params: GetUserDto, payload: UpdateUserDto): Promise<User> {
    const data: User = await this.findOneUser(params);

    if (payload.store_id) {
      const store = await this.findOneStore({ id: payload.store_id });
      data.store = store;
    }

    const uptatedData = this.userRepository.merge(data, payload);

    return await this.userRepository.save(uptatedData);
  }

  async deleteUser(params: GetUserDto): Promise<DeleteResult> {
    const data: User = await this.findOneUser(params);

    return await this.userRepository.delete({ id: data.id });
  }

  async login({ username, password }: LoginDto): Promise<User> {
    const data: User = await this.userRepository.findOne({
      relations: ['store'],
      where: { username, password }
    });
    if (!data) {
      throw new BadRequestException('Generic data not found');
    }
    delete data.password;
    return data;
  }
}
