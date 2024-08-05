import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskPropertyDto extends PartialType(CreateTaskDto) {
  @ApiProperty()
  id: number;
}
