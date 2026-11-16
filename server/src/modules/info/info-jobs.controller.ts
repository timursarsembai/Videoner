import { Controller, Get, Header, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiSecurity } from '@nestjs/swagger';
import { InfoJobsService } from './info-jobs.service';

@Controller('info/jobs')
@ApiSecurity('X-API-Key')
export class InfoJobsController {
  constructor(private readonly jobs: InfoJobsService) {}

  @Get(':id')
  @Header('Cache-Control', 'no-store')
  status(@Param('id') id: string, @Req() req: Request) {
    // The global guard authenticates and rate limits. The UUID is an opaque
    // capability, and a different API key cannot inspect its result.
    return this.jobs.get((req as any).apiKey.id, id);
  }
}
