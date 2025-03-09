import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { PrismaModule } from '@prisma/prisma.module';
import aiConfig from './config/ai.config';
import { MessageMapper } from './mappers/message.mapper';

@Module({
  imports: [ConfigModule.forFeature(aiConfig), PrismaModule],
  controllers: [AiController],
  providers: [AiService, MessageMapper],
  exports: [AiService],
})
export class AiModule {}
