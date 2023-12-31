import { PageOptionsDto } from '@common/dtos/page.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';

export class GetInventoriesDto extends PageOptionsDto {
  @ApiProperty()
  @IsNumber()
  store_id: number;
}

export class GetInventoryDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}

export class GetInventoryByEanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ean: string;
}

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ean: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  expiresIn: Date;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  daysBeforeRemove: number;

  @ApiProperty()
  @IsString()
  quantity: string;

  @IsNumber()
  @ApiProperty()
  store_id: number;
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}
