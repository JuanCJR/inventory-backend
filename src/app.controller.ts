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
  UpdateInventoryDto
} from './dtos/inventory.dto';
import { ErrorDefault } from '@common/interfaces/error.interface';

@ApiResponse({ status: '4XX', type: ErrorDefault })
@ApiResponse({ status: '5XX', type: ErrorDefault })
@ApiTags('Generic')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponsePaginated(GenericInterface)
  @Get()
  async find(@Query() queryParams: GetInventoriesDto) {
    return await this.appService.find(queryParams);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Get(':id')
  async findOne(@Param() params: GetInventoryDto) {
    return await this.appService.findOne(params);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Post()
  async create(@Body() payload: CreateInventoryDto) {
    return await this.appService.create(payload);
  }

  @ApiOkResponse({ type: GenericInterface })
  @Put(':id')
  async update(
    @Param() params: GetInventoryDto,
    @Body() payload: UpdateInventoryDto
  ) {
    return this.appService.update(params, payload);
  }

  @Delete(':id')
  async delete(@Param() params: GetInventoryDto) {
    return this.appService.delete(params);
  }
}
