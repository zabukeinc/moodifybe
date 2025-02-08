import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UpdateMoodEntryCommand } from '../update-mood-entry.command';

@CommandHandler(UpdateMoodEntryCommand)
export class UpdateMoodEntryHandler
  implements ICommandHandler<UpdateMoodEntryCommand>
{
  constructor(private prisma: PrismaService) {}

  async execute(command: UpdateMoodEntryCommand) {
    const { id, userId, updateMoodEntryDto } = command;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const entry = await this.prisma.moodEntry.findFirst({
      where: { id, user_id: userId },
    });

    if (!entry) {
      throw new NotFoundException(`Mood entry with ID ${id} not found`);
    }

    return this.prisma.moodEntry.update({
      where: { id },
      data: {
        ...updateMoodEntryDto,
        updated_at: new Date(),
      },
      include: {
        user: true,
      },
    });
  }
}
