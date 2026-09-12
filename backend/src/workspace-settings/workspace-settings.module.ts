import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceSettings } from './entities/workspace-settings.entity';
import { WorkspaceSettingsService } from './workspace-settings.service';
import { WorkspaceSettingsController } from './workspace-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceSettings])],
  controllers: [WorkspaceSettingsController],
  providers: [WorkspaceSettingsService],
})
export class WorkspaceSettingsModule {}