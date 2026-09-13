import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceSettings } from './entities/workspace-settings.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { WorkspaceSettingsService } from './workspace-settings.service';
import { WorkspaceSettingsController } from './workspace-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceSettings, Workspace])],
  controllers: [WorkspaceSettingsController],
  providers: [WorkspaceSettingsService],
})
export class WorkspaceSettingsModule {}