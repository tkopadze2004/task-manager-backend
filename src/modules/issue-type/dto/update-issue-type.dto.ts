import { PartialType } from '@nestjs/swagger';
import { CreateIssueTypeDto } from './create-issue-type.dto';

export class UpdateIssueTypeDto extends PartialType(CreateIssueTypeDto) {}
