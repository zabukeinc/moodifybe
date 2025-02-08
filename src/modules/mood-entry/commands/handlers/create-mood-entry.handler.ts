import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma/prisma.service';
import { CreateMoodEntryCommand } from '../create-mood-entry.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateMoodEntryCommand)
export class CreateMoodEntryHandler
  implements ICommandHandler<CreateMoodEntryCommand>
{
  constructor(private prisma: PrismaService) {}

  async execute(command: CreateMoodEntryCommand) {
    const { userId, createMoodEntryDto } = command;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const now = new Date();

    return this.prisma.moodEntry.create({
      data: {
        mood_score: createMoodEntryDto.moodScore,
        note: createMoodEntryDto.note,
        tags: createMoodEntryDto.tags,
        user_id: userId,
        created_at: now,
        updated_at: now,
      },
      include: {
        user: true,
      },
    });
  }
}
