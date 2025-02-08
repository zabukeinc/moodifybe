import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { GetUserQuery } from '../get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(query: GetUserQuery) {
    const user = await this.prisma.user.findUnique({
      where: { id: query.id },
      include: {
        user_profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${query.id} not found`);
    }

    return user;
  }
}
