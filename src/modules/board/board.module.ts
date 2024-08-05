import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from './entities/board-column.entity';
import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardColumn])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
