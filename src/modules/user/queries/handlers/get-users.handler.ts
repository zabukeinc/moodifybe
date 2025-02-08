import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma/prisma.service';
import { GetUsersQuery } from '../get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(query: GetUsersQuery) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          user_profile: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total };
  }
}
