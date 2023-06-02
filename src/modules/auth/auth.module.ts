import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../common/database/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}