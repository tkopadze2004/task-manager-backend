import { ApiProperty } from '@nestjs/swagger';
import { IssueTypeEnum } from '../../../common/enums/issue-type.enum';
import { IssueTypeColumn } from '../entities/issue-type-column.entity';
import { IssueType } from '../entities/issue-type.entity';
import { IssueTypeDto } from './issue-type.dto';

export class CreateIssueTypeColumnDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  filedName: string;

  @ApiProperty()
  isRequired: boolean;

  @ApiProperty()
  issueTypeId: number;
}
