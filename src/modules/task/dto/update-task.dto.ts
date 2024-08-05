import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskPropertyDto } from './update-task-property.dto';
import { TaskProperty } from '../entities/task-property.entity';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    type: () => UpdateTaskPropertyDto,
    isArray: true,
  })
  taskProperty: TaskProperty[];
}
