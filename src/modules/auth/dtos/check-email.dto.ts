import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckEmailDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
