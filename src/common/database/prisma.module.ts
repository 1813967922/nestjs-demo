import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 定义全局之后，任何模块都可以直接使用prismaService
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
