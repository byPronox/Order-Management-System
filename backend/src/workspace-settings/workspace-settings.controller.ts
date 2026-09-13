import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { WorkspaceSettingsService } from './workspace-settings.service';

@Controller('workspace-settings')
export class WorkspaceSettingsController {
  constructor(private readonly settingsService: WorkspaceSettingsService) {}

  @Get()
  findSettings(@Query('workspaceId') workspaceId?: string) {
    if (!workspaceId) throw new BadRequestException('workspaceId is required');
    return this.settingsService.findByWorkspace(+workspaceId);
  }
}