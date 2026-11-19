import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdultAuthorsService } from './adult-authors.service';

@Module({
  providers: [AdultAuthorsService, PrismaService],
  exports: [AdultAuthorsService],
})
export class AdultAuthorsModule {}
