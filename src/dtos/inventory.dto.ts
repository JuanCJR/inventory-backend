import { PageOptionsDto } from '@common/dtos/page.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';

export class GetInventoriesDto extends PageOptionsDto {}

export class GetInventoryDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ean: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  expiresIn: Date;
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}
