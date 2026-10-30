import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserCookieCodesController, UserCookiesController } from './user-cookies.controller';
import { UserCookiesService } from './user-cookies.service';

@Module({
  imports: [PrismaModule],
  providers: [UserCookiesService],
  controllers: [UserCookiesController, UserCookieCodesController],
  exports: [UserCookiesService],
})
export class UserCookiesModule {}
