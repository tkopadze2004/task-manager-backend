import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class SignupDto {
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
