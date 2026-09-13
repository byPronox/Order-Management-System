import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceSettings } from '../workspace-settings/entities/workspace-settings.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspacesRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceSettings)
    private readonly settingsRepository: Repository<WorkspaceSettings>,
  ) {}

  findAll() {
    return this.workspacesRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const workspace = await this.workspacesRepository.findOne({ where: { id } });
    if (!workspace) throw new NotFoundException(`Workspace #${id} not found`);
    return workspace;
  }

  async create(dto: CreateWorkspaceDto) {
    let baseSlug = slugify(dto.name);
    let slug = baseSlug;
    let suffix = 1;

    while (await this.workspacesRepository.findOne({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const workspace = this.workspacesRepository.create({ name: dto.name, slug });
    const saved = await this.workspacesRepository.save(workspace);

    const settings = this.settingsRepository.create({
      workspaceId: saved.id,
      workspaceName: saved.name,
    });
    await this.settingsRepository.save(settings);

    return saved;
  }
}