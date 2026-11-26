import { ExecutionContext } from '@nestjs/common';

import { Injectable } from '@nestjs/common';

import { BadRequestException, CanActivate } from '@nestjs/common';
import { getPlatform } from 'src/validate/url';
import { isInstagramShareUrl, resolveInstagramShare } from 'src/lib/instagram-share';

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

    // Ссылка «Поделиться» Instagram (/share/<код>) — сначала раскрываем в
    // настоящую ссылку на пост (lib/instagram-share.ts), дальше всё как обычно.
    if (isInstagramShareUrl(url)) {
      const resolved = await resolveInstagramShare(url);
      if (!resolved) {
        throw new BadRequestException('Instagram share link could not be opened: the platform refused to serve it to our server.');
      }
      request.body.url = resolved;
      return this.canActivate(context);
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
