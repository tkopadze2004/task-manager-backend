import { Injectable } from '@nestjs/common';
import { CreateIssueTypeDto } from './dto/create-issue-type.dto';
import { UpdateIssueTypeDto } from './dto/update-issue-type.dto';
import { IssueTypeDto } from './dto/issue-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueType } from './entities/issue-type.entity';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { IssueTypeColumn } from './entities/issue-type-column.entity';
import { Project } from '../project/project.entity';

@Injectable()
export class IssueTypeService {
  constructor(
    @InjectRepository(IssueType)
    private readonly repository: Repository<IssueType>,
  ) {}

  async create(dto: CreateIssueTypeDto): Promise<IssueTypeDto> {
    const issueType = new IssueType();
    issueType.name = dto.name;
    issueType.description = dto.description;
    issueType.icon = dto.icon;
    issueType.color = dto.color;
    issueType.isActive = dto.isActive;
    issueType.type = dto.type;
    issueType.projectId = dto.projectId;
    const issueTypeCreate = await this.repository.save(issueType);
    if (dto.issueTypeColumns && dto.issueTypeColumns.length > 0) {
      const issueTypeColumns: IssueTypeColumn[] = [];
      dto.issueTypeColumns.forEach((item) => {
        const issueTypeColumn = new IssueTypeColumn();
        issueTypeColumn.name = item.name;
        issueTypeColumn.filedName = item.filedName;
        issueTypeColumn.isRequired = item.isRequired;
        issueTypeColumn.issueTypeId = issueTypeCreate.id;
        issueTypeColumns.push(issueTypeColumn);
      });
      issueTypeCreate.issueTypeColumns = await this.repository.manager.save(
        IssueTypeColumn,
        issueTypeColumns,
      );
    }
    const savedIssueType = await this.repository.save(issueTypeCreate);
    return savedIssueType as IssueTypeDto;
  }

  async findAll(project: Project): Promise<IssueTypeDto[]> {
    try {
      return (await this.repository.find({
        relations: ['issueTypeColumns'],
        where: { projectId: project.id },
      })) as IssueTypeDto[];
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async findOne(id: number, project: Project): Promise<IssueTypeDto> {
    return (await this.repository.findOne({
      where: { id: id, projectId: project.id },
      relations: ['issueTypeColumns'],
    })) as IssueTypeDto;
  }

  async update(id: number, dto: UpdateIssueTypeDto): Promise<IssueTypeDto> {
    try {
      const findIssueType = await this.repository.findOne({
        where: { id: id, projectId: dto.projectId },
        relations: ['issueTypeColumns'],
      });
      console.log(findIssueType);
      if (!findIssueType) {
        throw new ExceptionType(404, 'Issue type not found');
      }
      const deleteIssueTypeColumns = findIssueType.issueTypeColumns.filter(
        (f) => !dto.issueTypeColumns.find((i) => i.id === f.id),
      );
      if (deleteIssueTypeColumns && deleteIssueTypeColumns.length > 0) {
        deleteIssueTypeColumns.forEach(async (item) => {
          await this.repository.manager.softDelete(IssueTypeColumn, {
            id: item.id,
          });
        });
      }

      if (dto.issueTypeColumns && dto.issueTypeColumns.length > 0) {
        const issueTypeColumns: IssueTypeColumn[] = [];
        dto.issueTypeColumns.forEach((item) => {
          const findIssueTypeColumn = findIssueType.issueTypeColumns.find(
            (f) => f.id === item.id,
          );
          if (findIssueTypeColumn) {
            findIssueTypeColumn.name = item.name;
            findIssueTypeColumn.filedName = item.filedName;
            findIssueTypeColumn.isRequired = item.isRequired;
            issueTypeColumns.push(findIssueTypeColumn);
          }
          if (!findIssueTypeColumn) {
            const issueTypeColumn = new IssueTypeColumn();
            issueTypeColumn.name = item.name;
            issueTypeColumn.filedName = item.filedName;
            issueTypeColumn.isRequired = item.isRequired;
            issueTypeColumn.issueTypeId = findIssueType.id;
            issueTypeColumns.push(issueTypeColumn);
          }
        });
        findIssueType.issueTypeColumns = await this.repository.manager.save(
          IssueTypeColumn,
          issueTypeColumns,
        );
      }
      findIssueType.name = dto.name;
      findIssueType.description = dto.description;
      findIssueType.icon = dto.icon;
      findIssueType.color = dto.color;
      findIssueType.isActive = dto.isActive;
      findIssueType.type = dto.type;
      const savedIssueType = await this.repository.save(findIssueType);

      return savedIssueType as IssueTypeDto;
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async remove(id: number, project: Project): Promise<DeleteDto> {
    try {
      await this.repository.softDelete({ id: id, projectId: project.id });
      return { deleted: true };
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }
}
