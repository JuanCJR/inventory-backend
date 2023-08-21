import { PageOptionsDto } from '@common/dtos/page.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class GetStoresDto extends PageOptionsDto {}

export class GetStoreDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
