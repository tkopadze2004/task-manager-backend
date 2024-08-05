import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IssueTypeEnum } from "../../../common/enums/issue-type.enum";
import { IssueTypeColumn } from "../entities/issue-type-column.entity";
import { IssueTypeColumnDto } from "./issue-type-column.dto";
import { CreateIssueTypeColumnDto } from "./create-issue-type-column.dto";

export class CreateIssueTypeDto {

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

  @ApiPropertyOptional({
    type: () => CreateIssueTypeColumnDto,
    isArray: true,
  })
  issueTypeColumns: IssueTypeColumn[];

  projectId: number;
}
