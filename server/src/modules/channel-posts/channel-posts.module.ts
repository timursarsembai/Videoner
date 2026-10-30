import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ChannelPostsController } from './channel-posts.controller';
import { ChannelPostsService } from './channel-posts.service';

@Module({
  imports: [PrismaModule],
  providers: [ChannelPostsService],
  controllers: [ChannelPostsController],
})
export class ChannelPostsModule {}
