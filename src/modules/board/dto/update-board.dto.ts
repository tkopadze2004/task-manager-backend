import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBoardDto } from './create-board.dto';
import { CreateBoardColumnDto } from './create-board-column.dto';
import { IsNotEmpty } from 'class-validator';
import { BoardColumnDto } from './board-column.dto';
import { UpdateBoardColumnDto } from './update-board-column.dto';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @ApiProperty({
    type: () => UpdateBoardColumnDto,
    isArray: true,
  })
  @IsNotEmpty()
  columns: BoardColumnDto[];
}
