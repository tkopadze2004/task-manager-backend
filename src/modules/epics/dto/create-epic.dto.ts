import { ApiProperty } from "@nestjs/swagger";

export class CreateEpicDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  position: number;

  projectId: number;
}
