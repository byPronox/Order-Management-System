import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceSettings } from './entities/workspace-settings.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { UpdateWorkspaceSettingsDto } from './dto/update-workspace-settings.dto';

@Injectable()
export class WorkspaceSettingsService {
  constructor(
    @InjectRepository(WorkspaceSettings)
    private readonly settingsRepository: Repository<WorkspaceSettings>,
    @InjectRepository(Workspace)
    private readonly workspacesRepository: Repository<Workspace>,
  ) {}

  async findByWorkspace(workspaceId: number) {
    let settings = await this.settingsRepository.findOne({ where: { workspaceId } });

    if (!settings) {
      const workspace = await this.workspacesRepository.findOne({ where: { id: workspaceId } });
      if (!workspace) {
        throw new NotFoundException(`Workspace #${workspaceId} not found`);
      }

      settings = this.settingsRepository.create({
        workspaceId,
        workspaceName: workspace.name,
      });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async update(workspaceId: number, dto: UpdateWorkspaceSettingsDto) {
    const settings = await this.findByWorkspace(workspaceId);
    Object.assign(settings, dto);
    await this.settingsRepository.save(settings);

    if (dto.workspaceName) {
      await this.workspacesRepository.update(workspaceId, { name: dto.workspaceName });
    }

    return this.findByWorkspace(workspaceId);
  }
}