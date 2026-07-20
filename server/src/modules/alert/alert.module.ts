import { Global, Module } from '@nestjs/common';
import { AlertService } from './alert.service';

@Global()
@Module({
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
