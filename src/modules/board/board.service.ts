import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardDto } from './dto/board.dto';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { BoardColumn } from './entities/board-column.entity';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { RoleType } from '../../common/enums';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private dataSource: DataSource,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<BoardDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const board = new Board();
      board.name = createBoardDto.name;
      board.description = createBoardDto.description;
      board.position = createBoardDto.position;
      board.projectId = createBoardDto.projectId;
      const savedBoard = await queryRunner.manager.save(Board, board);
      if (createBoardDto.columns && createBoardDto.columns.length > 0) {
        const boardColumns: BoardColumn[] = [];
        createBoardDto.columns.forEach((column) => {
          const boardColumn = new BoardColumn();
          boardColumn.name = column.name;
          boardColumn.description = column.description;
          boardColumn.position = column.position;
          boardColumn.taskStatus = column.taskStatus;
          boardColumn.boardId = savedBoard.id;
          boardColumns.push(boardColumn);
        });
        await queryRunner.manager.save(BoardColumn, boardColumns);
      }
      await queryRunner.commitTransaction();
      return await this.findOne(savedBoard.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ExceptionType(error.statusCode, error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(projectId: number): Promise<BoardDto[]> {
    return (await this.boardRepository.find({
      where: { projectId },
      relations: ['columns'],
    })) as BoardDto[];
  }

  async findOne(id: number): Promise<BoardDto> {
    try {
      // Todo order columns by position
      const board = await this.boardRepository.findOne({
        where: { id },
        relations: ['columns'],
        order: {
          columns: {
            position: 'ASC',
          },
        },
      });
      if (!board) {
        throw new ExceptionType(404, 'Board not found');
      }
      return board as BoardDto;
    } catch (error) {
      throw new ExceptionType(error.statusCode, error.message);
    }
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<BoardDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const board = await this.findOne(id);
      board.name = updateBoardDto.name;
      board.description = updateBoardDto.description;
      board.position = updateBoardDto.position;


      const deleteBoardColumns = board.columns.filter(
        (boardColumn) =>
          !updateBoardDto.columns.find(
            (column) => column.id === boardColumn.id,
          ),
      );

      if (deleteBoardColumns && deleteBoardColumns.length > 0) {
        await queryRunner.manager.softDelete(BoardColumn, deleteBoardColumns);
      }

      if (updateBoardDto.columns && updateBoardDto.columns.length > 0) {
        const boardColumns: BoardColumn[] = [];
        updateBoardDto.columns.forEach((column) => {
          const findBoardColumn = board.columns.find(
            (boardColumn) => boardColumn.id === column.id,
          );
          if (findBoardColumn) {
            findBoardColumn.name = column.name;
            findBoardColumn.description = column.description;
            findBoardColumn.position = column.position;
            findBoardColumn.taskStatus = column.taskStatus;
            boardColumns.push(findBoardColumn);
          } else {
            const boardColumn = new BoardColumn();
            boardColumn.name = column.name;
            boardColumn.description = column.description;
            boardColumn.position = column.position;
            boardColumn.taskStatus = column.taskStatus;
            boardColumn.boardId = board.id;
            boardColumns.push(boardColumn);
          }
        });
        board.columns = await queryRunner.manager.save(
          BoardColumn,
          boardColumns,
        );
      }

      await queryRunner.manager.save(Board, board);
      await queryRunner.commitTransaction();
      return board;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ExceptionType(error.statusCode, error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<DeleteDto> {
    await this.findOne(id);
    try {
      await this.boardRepository.softDelete(id);
      return { deleted: true };
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }
}
