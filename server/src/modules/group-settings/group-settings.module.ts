import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupSettingsController } from './group-settings.controller';
import { GroupSettingsService } from './group-settings.service';

@Module({
  imports: [PrismaModule],
  providers: [GroupSettingsService],
  controllers: [GroupSettingsController],
})
export class GroupSettingsModule {}
