import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceSettings } from './entities/workspace-settings.entity';

@Injectable()
export class WorkspaceSettingsService {
  constructor(
    @InjectRepository(WorkspaceSettings)
    private readonly settingsRepository: Repository<WorkspaceSettings>,
  ) {}

  async findByWorkspace(workspaceId: number) {
    const settings = await this.settingsRepository.findOne({ where: { workspaceId } });
    if (!settings) throw new NotFoundException(`Settings for workspace #${workspaceId} not found`);
    return settings;
  }
}