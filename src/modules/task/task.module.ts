import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskProperty } from './entities/task-property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskProperty])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
