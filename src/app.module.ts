import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { MoodEntryModule } from './modules/mood-entry/mood-entry.module';
import { AuthModule } from './modules/auth/auth.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MoodEntryModule,
    AiModule,
    // ... other modules
  ],
})
export class AppModule {}
