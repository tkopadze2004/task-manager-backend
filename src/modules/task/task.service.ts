import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskProperty } from './entities/task-property.entity';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { BoardColumn } from '../board/entities/board-column.entity';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateTaskDto): Promise<TaskDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const task = new Task();
      task.name = dto.name;
      task.description = dto.description;
      task.issueTypeId = dto.issueTypeId;
      task.epicId = dto.epicId;
      task.boardId = dto.boardId;
      task.boardColumnId = dto.boardColumnId;
      task.projectId = dto.projectId;
      task.isBacklog = dto.isBacklog;
      task.priority = dto.priority;
      task.taskStatus = dto.taskStatus;
      task.assigneeId = dto.assigneeId;
      task.reporterId = dto.reporterId;
      task.createdById = dto.createdById;
      const result = await queryRunner.manager.save(task);
      if (dto.taskProperty && dto.taskProperty.length > 0) {
        const taskProperties: TaskProperty[] = [];
        dto.taskProperty.forEach((taskProperty) => {
          const taskPropertyEntity = new TaskProperty();
          taskPropertyEntity.taskId = result.id;
          taskPropertyEntity.value = taskProperty.value;
          taskPropertyEntity.filedName = taskProperty.filedName;
          taskPropertyEntity.isRequired = taskProperty.isRequired;
          taskPropertyEntity.name = taskProperty.name;
          taskProperties.push(taskPropertyEntity);
        });
        await queryRunner.manager.save(TaskProperty, taskProperties);
      }
      await queryRunner.commitTransaction();
      return await this.findOne(result.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ExceptionType(error.statusCode, error.message);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async findAll(projectId: number, dto: GetTasksDto): Promise<TaskDto[]> {
    return await this.repository.find({
      where: { projectId, boardId: dto.boardId, isBacklog: dto.isBacklog },
      relations: [
        'taskProperties',
        'project',
        'epic',
        'issueType',
        'board',
        'boardColumn',
        'createdBy',
        'deletedBy',
        'assignee',
        'reporter',
      ],
    });
  }

  async findAllMy(userId: number): Promise<TaskDto[]> {
    return await this.repository.find({
      where: {
        assigneeId: userId
      },
      relations: [
        'taskProperties',
        'project',
        'epic',
        'issueType',
        'board',
        'boardColumn',
        'createdBy',
        'deletedBy',
        'assignee',
        'reporter',
      ],
    });
  }

  async findOne(id: number): Promise<TaskDto> {
    try {
      const task = await this.repository.findOne({
        where: { id },
        relations: [
          'taskProperties',
          'project',
          'epic',
          'issueType',
          'board',
          'boardColumn',
          'createdBy',
          'deletedBy',
          'assignee',
          'reporter',
        ],
      });
      if (!task) {
        throw new ExceptionType(404, 'Task not found');
      }
      return task;
    } catch (error) {
      throw new ExceptionType(error.statusCode, error.message);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<TaskDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const task = await queryRunner.manager.findOne(Task, {
        where: { id },
      });
      if (!task) {
        throw new ExceptionType(404, 'Task not found');
      }
      const boardColumn = await queryRunner.manager.findOne(BoardColumn, {
        where: {
          boardId: updateTaskDto.boardId,
          taskStatus: updateTaskDto.taskStatus,
        },
        order: {
          position: 'ASC',
        },
      });

      task.name = updateTaskDto.name;
      task.description = updateTaskDto.description;
      task.issueTypeId = updateTaskDto.issueTypeId;
      task.epicId = updateTaskDto.epicId;
      task.boardId = updateTaskDto.boardId;
      task.boardColumnId = updateTaskDto.boardColumnId || boardColumn.id;
      task.isBacklog = updateTaskDto.isBacklog;
      task.priority = updateTaskDto.priority;
      task.taskStatus = updateTaskDto.taskStatus;
      task.assigneeId = updateTaskDto.assigneeId;
      task.reporterId = updateTaskDto.reporterId;
      const result = await queryRunner.manager.save(task);
      if (updateTaskDto.taskProperty && updateTaskDto.taskProperty.length > 0) {
        const taskProperties: TaskProperty[] = [];
        for (const taskProperty of updateTaskDto.taskProperty) {
          const findTaskProperty = await queryRunner.manager.findOne(
            TaskProperty,
            {
              where: { id: taskProperty.id },
            },
          );
          if (findTaskProperty) {
            findTaskProperty.value = taskProperty.value;
            findTaskProperty.filedName = taskProperty.filedName;
            findTaskProperty.isRequired = taskProperty.isRequired;
            findTaskProperty.name = taskProperty.name;
            taskProperties.push(findTaskProperty);
          } else {
            const taskPropertyEntity = new TaskProperty();
            taskPropertyEntity.taskId = result.id;
            taskPropertyEntity.value = taskProperty.value;
            taskPropertyEntity.filedName = taskProperty.filedName;
            taskPropertyEntity.isRequired = taskProperty.isRequired;
            taskPropertyEntity.name = taskProperty.name;
            taskProperties.push(taskPropertyEntity);
          }
        }
        await queryRunner.manager.save(TaskProperty, taskProperties);
      }
      await queryRunner.commitTransaction();
      return await this.findOne(result.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ExceptionType(error.statusCode, error.message);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<DeleteDto> {
    await this.findOne(id);
    try {
      await this.repository.softDelete(id);
      return { deleted: true };
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }
}
