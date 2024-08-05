import { ApiProperty } from '@nestjs/swagger';
import { IssueTypeEnum } from '../../../common/enums/issue-type.enum';
import { IssueTypeColumn } from '../entities/issue-type-column.entity';
import { IssueTypeColumnDto } from "./issue-type-column.dto";

export class IssueTypeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({
    enum: IssueTypeEnum,
    default: IssueTypeEnum.Task,
  })
  type: IssueTypeEnum;

  @ApiProperty({
    type: () => IssueTypeColumnDto,
    isArray: true,
  })
  issueTypeColumns: IssueTypeColumn[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
