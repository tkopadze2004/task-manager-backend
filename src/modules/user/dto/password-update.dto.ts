import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";

export class PasswordUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly checkPassword: string;

  userId: number;
}
