import { PageOptionsDto } from '@common/dtos/page.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class GetUsersDto extends PageOptionsDto {}

export class GetUserDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNumber()
  @ApiProperty()
  store_id: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
