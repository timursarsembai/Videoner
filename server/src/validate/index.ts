import {
  DownloadKeyWord,
  DownloadOptions,
  Platform,
  StreamKeyWord,
  StreamOptions,
} from 'src/types';
import { DownloadOptionsSchema, StreamOptionsSchema } from './schema';
import { thr } from 'src/lib/utils';
import { getPlatform } from './url';
import { BadRequestException } from '@nestjs/common';

export function StreamOptionsValidate<T extends StreamKeyWord>(
  options?: StreamOptions<T>,
) {
  return StreamOptionsSchema.safeParse(options);
}

export function DownloadOptionsValidate<T extends DownloadKeyWord>(
  options?: DownloadOptions<T>,
) {
  return DownloadOptionsSchema.safeParse(options);
}

export function parseAndValidateUrl(
  url: string,
  platform: Platform,
): string | undefined {
  try {
    const urlPlatform = getPlatform(url);
    if (urlPlatform !== platform) {
      throw new BadRequestException(`Inavlid ${platform} url`);
    }
    return url;
  } catch (err) {
    return undefined;
  }
}
