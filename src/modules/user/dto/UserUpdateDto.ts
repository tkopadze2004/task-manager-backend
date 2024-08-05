import { UserCreateDto } from './user-create.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UserUpdateDto extends PartialType(UserCreateDto) {
  @ApiProperty()
  isActive: boolean;
}
