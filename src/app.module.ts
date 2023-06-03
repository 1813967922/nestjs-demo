import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from './common/database/prisma.module'
import { AuthGuard } from './common/guard/auth.guard'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
