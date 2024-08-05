import { Injectable } from '@nestjs/common';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { EpicDto } from './dto/epic.dto';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epic } from './entities/epic.entity';

@Injectable()
export class EpicsService {
  constructor(
    @InjectRepository(Epic)
    private readonly repository: Repository<Epic>,
  ) {}

  async create(createEpicDto: CreateEpicDto): Promise<EpicDto> {
    try {
      const epic = new Epic();
      epic.name = createEpicDto.name;
      epic.projectId = createEpicDto.projectId;
      epic.description = createEpicDto.description;
      epic.position = createEpicDto.position;

      return await this.repository.save(epic);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async findAll(projectId: number): Promise<EpicDto[]> {
    try {
      return await this.repository.find({
        where: { projectId },
      });
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async findOne(id: number): Promise<EpicDto> {
    try {
      const project = await this.repository.findOne({
        where: { id },
      });
      if (!project) {
        throw new ExceptionType(404, 'Epic not found');
      }
      // console.log(project);
      return project as EpicDto;
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async update(id: number, updateEpicDto: UpdateEpicDto): Promise<EpicDto> {
    try {
      const epic = await this.findOne(id);
      epic.name = updateEpicDto.name;
      epic.description = updateEpicDto.description;
      epic.position = updateEpicDto.position;
      return await this.repository.save(epic);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async remove(id: number): Promise<DeleteDto> {
    try {
      await this.findOne(id);
      await this.repository.softDelete(id);
      return { deleted: true };
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }
}
