import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { SharingModule } from '../sharing.module';

@Global()
@Module({
  imports: [SharingModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
