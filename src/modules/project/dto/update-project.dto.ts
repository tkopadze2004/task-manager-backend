import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './project-create.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
