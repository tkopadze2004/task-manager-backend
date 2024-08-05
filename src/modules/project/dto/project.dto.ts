import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Board } from '../../board/entities/board.entity';
import { BoardDto } from '../../board/dto/board.dto';

export class ProjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ type: [BoardDto] })
  boards: BoardDto[];
}
