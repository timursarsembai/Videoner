import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicStatsService } from './public-stats.service';

// Без @AdminOnly: страницу «Videoner в цифрах» сайт собирает на своём сервере
// с общим API-ключом (web lib/public-stats.ts). Цифры — только итоговые, без
// людей и ссылок.
@ApiTags('Stats')
@Controller('stats')
export class PublicStatsController {
  constructor(private readonly stats: PublicStatsService) {}

  @Get('public')
  get() {
    return this.stats.get();
  }
}
