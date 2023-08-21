import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponsePaginated } from './decorators/ApiOkResponsePaginated';
import { GenericInterface } from './interfaces/generic.interfaces';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateInventoryDto,
  GetInventoryDto,
  GetInventoriesDto,
  UpdateInventoryDto,
  GetInventoryByEanDto
} from './dtos/inventory.dto';
import { ErrorDefault } from '@common/interfaces/error.interface';
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

@ApiResponse({ status: '4XX', type: ErrorDefault })
@ApiResponse({ status: '5XX', type: ErrorDefault })
@ApiTags('Generic')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponsePaginated(GenericInterface)
  @Get('inventory')
  async find(@Query() queryParams: GetInventoriesDto) {
    return await this.appService.find(queryParams);
  }

  @ApiOkResponsePaginated(GenericInterface)
  @Get('inventory/alert')
  async findProductWithAlert(@Query() queryParams: GetInventoriesDto) {
    return await this.appService.findProductWithAlert(queryParams);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Get('inventory/:id')
  async findOne(@Param() params: GetInventoryDto) {
    return await this.appService.findOne(params);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Get('inventory/ean/:ean')
  async findByEan(@Param() params: GetInventoryByEanDto) {
    return await this.appService.findByEan(params);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Post('inventory')
  async create(@Body() payload: CreateInventoryDto) {
    return await this.appService.create(payload);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Put('inventory/:id')
  async update(
    @Param() params: GetInventoryDto,
    @Body() payload: UpdateInventoryDto
  ) {
    return this.appService.update(params, payload);
  }

  @Delete('inventory/:id')
  async delete(@Param() params: GetInventoryDto) {
    return this.appService.delete(params);
  }

  ///Store Controller
  @Get('store')
  @ApiOkResponsePaginated(GenericInterface)
  @Get()
  async findStore(@Query() queryParams: GetStoresDto) {
    return await this.appService.findStores(queryParams);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Get('store/:id')
  async findOneStore(@Param() params: GetStoreDto) {
    return await this.appService.findOneStore(params);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Post('store')
  async createStore(@Body() payload: CreateStoreDto) {
    return await this.appService.createStore(payload);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Put('store/:id')
  async updateStore(
    @Param() params: GetStoreDto,
    @Body() payload: UpdateStoreDto
  ) {
    return this.appService.updateStore(params, payload);
  }

  @Delete('store/:id')
  async deleteStore(@Param() params: GetStoreDto) {
    return this.appService.deleteStore(params);
  }

  ///User Controller
  @ApiOkResponsePaginated(GenericInterface)
  @Get('user')
  async findUsers(@Query() queryParams: GetUsersDto) {
    return await this.appService.find(queryParams);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Get('user/:id')
  async findOneUser(@Param() params: GetUserDto) {
    return await this.appService.findOneUser(params);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Post('user')
  async createUser(@Body() payload: CreateUserDto) {
    return await this.appService.createUser(payload);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Put('user/:id')
  async updateUser(
    @Param() params: GetUserDto,
    @Body() payload: UpdateUserDto
  ) {
    return this.appService.updateUser(params, payload);
  }

  @Delete('user/:id')
  async deleteUser(@Param() params: GetUserDto) {
    return this.appService.deleteUser(params);
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.appService.login(payload);
  }
}
