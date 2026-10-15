import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShareLinkController } from './share-link.controller';
import { ShareLinkService } from './share-link.service';

@Module({
  imports: [PrismaModule],
  providers: [ShareLinkService],
  controllers: [ShareLinkController],
})
export class ShareLinkModule {}
