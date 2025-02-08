import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MoodEntryController } from './mood-entry.controller';
import { PrismaModule } from '@prisma/prisma.module';
import { GetMoodEntriesHandler } from './queries/handlers/get-mood-entries.handler';
import { GetMoodEntryHandler } from './queries/handlers/get-mood-entry.handler';
import { CreateMoodEntryHandler } from './commands/handlers/create-mood-entry.handler';
import { UpdateMoodEntryHandler } from './commands/handlers/update-mood-entry.handler';
import { DeleteMoodEntryHandler } from './commands/handlers/delete-mood-entry.handler';

const CommandHandlers = [
  CreateMoodEntryHandler,
  UpdateMoodEntryHandler,
  DeleteMoodEntryHandler,
];
const QueryHandlers = [GetMoodEntriesHandler, GetMoodEntryHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [MoodEntryController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class MoodEntryModule {}
