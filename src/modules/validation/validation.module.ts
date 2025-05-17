// validation.module.ts

import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { LoginIsExistConstraint } from './decorators/validate/login.isExist.decorator';
import { EmailIsExistConstraint } from './decorators/validate/email.isExist.decorator';

@Module({
  imports: [UserModule], // нужен для доступа к UserService
  providers: [LoginIsExistConstraint, EmailIsExistConstraint],
  exports: [LoginIsExistConstraint, EmailIsExistConstraint],
})
export class ValidationModule {}
