import { ExecutionContext } from '@nestjs/common';

import { Injectable } from '@nestjs/common';

import { BadRequestException, CanActivate } from '@nestjs/common';
import { getPlatform } from 'src/validate/url';

@Injectable()
export class ValidUrlGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.body.url;
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    try {
      new URL(url);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    const platform = getPlatform(url);
    if (!platform) {
      throw new BadRequestException(
        'URL not supported. Please provide a valid URL',
      );
    }
    console.log(platform);
    request.platform = platform;
    return true;
  }
}
