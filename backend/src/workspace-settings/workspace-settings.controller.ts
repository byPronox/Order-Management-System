import { BadRequestException, Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { WorkspaceSettingsService } from './workspace-settings.service';
import { UpdateWorkspaceSettingsDto } from './dto/update-workspace-settings.dto';

@Controller('workspace-settings')
export class WorkspaceSettingsController {
  constructor(private readonly settingsService: WorkspaceSettingsService) {}

  @Get()
  findSettings(@Query('workspaceId') workspaceId?: string) {
    if (!workspaceId) throw new BadRequestException('workspaceId is required');
    return this.settingsService.findByWorkspace(+workspaceId);
  }

  @Patch()
  update(@Query('workspaceId') workspaceId: string, @Body() dto: UpdateWorkspaceSettingsDto) {
    if (!workspaceId) throw new BadRequestException('workspaceId is required');
    return this.settingsService.update(+workspaceId, dto);
  }
}