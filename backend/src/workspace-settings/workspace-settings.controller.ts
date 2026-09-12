import { Controller, Get } from '@nestjs/common';
import { WorkspaceSettingsService } from './workspace-settings.service';

@Controller('workspace-settings')
export class WorkspaceSettingsController {
  constructor(private readonly settingsService: WorkspaceSettingsService) {}

  @Get()
  findSettings() {
    return this.settingsService.findSettings();
  }
}