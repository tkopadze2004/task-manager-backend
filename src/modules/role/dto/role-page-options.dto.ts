import { PageOptionDto } from '../../../common/dtos/page-option.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../../../common/enums';

export class RolePageOptionsDto extends PageOptionDto {
  @ApiPropertyOptional({ enum: RoleType, type: () => RoleType })
  type: RoleType;
}
