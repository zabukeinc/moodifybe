import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { DeleteMoodEntryCommand } from '../delete-mood-entry.command';

@CommandHandler(DeleteMoodEntryCommand)
export class DeleteMoodEntryHandler
  implements ICommandHandler<DeleteMoodEntryCommand>
{
  constructor(private prisma: PrismaService) {}

  async execute(command: DeleteMoodEntryCommand) {
    const { id, userId } = command;

    const entry = await this.prisma.moodEntry.findFirst({
      where: { id, user_id: userId },
    });

    if (!entry) {
      throw new NotFoundException(`Mood entry with ID ${id} not found`);
    }

    return this.prisma.moodEntry.delete({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}
