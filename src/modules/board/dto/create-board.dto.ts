import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BoardColumn } from "../entities/board-column.entity";
import { BoardColumnDto } from "./board-column.dto";
import { CreateBoardColumnDto } from "./create-board-column.dto";

export class CreateBoardDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  position: number;

  @ApiProperty({
    type: () => CreateBoardColumnDto,
    isArray: true,
  })
  @IsNotEmpty()
  columns: CreateBoardColumnDto[];

  projectId: number;
}
