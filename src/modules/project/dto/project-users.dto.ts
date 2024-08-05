import { ApiProperty } from '@nestjs/swagger';

export class ProjectUsersDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  userIds: number[];
}
