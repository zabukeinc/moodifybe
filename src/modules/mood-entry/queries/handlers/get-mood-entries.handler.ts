import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma/prisma.service';
import { GetMoodEntriesQuery } from '../get-mood-entries.query';
import { Prisma } from '@prisma/client';

@QueryHandler(GetMoodEntriesQuery)
export class GetMoodEntriesHandler
  implements IQueryHandler<GetMoodEntriesQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(query: GetMoodEntriesQuery) {
    const { filters } = query;
    const { page, limit, userId, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.MoodEntryWhereInput = {};

    if (userId) {
      whereClause.user_id = userId;
    }

    if (startDate || endDate) {
      whereClause.created_at = {};
      if (startDate) {
        whereClause.created_at.gte = startDate;
      }
      if (endDate) {
        whereClause.created_at.lte = endDate;
      }
    }

    const [entries, total] = await Promise.all([
      this.prisma.moodEntry.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.moodEntry.count({
        where: whereClause,
      }),
    ]);

    return { entries, total };
  }
}
