import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { GetMoodEntryQuery } from '../get-mood-entry.query';

@QueryHandler(GetMoodEntryQuery)
export class GetMoodEntryHandler implements IQueryHandler<GetMoodEntryQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(query: GetMoodEntryQuery) {
    const { id, userId } = query;
    const entry = await this.prisma.moodEntry.findFirst({
      where: {
        id,
        user_id: userId,
      },
      include: {
        user: true,
      },
    });

    if (!entry) {
      throw new NotFoundException(`Mood entry with ID ${id} not found`);
    }

    return entry;
  }
}
