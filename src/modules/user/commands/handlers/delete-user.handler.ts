import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../delete-user.command';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler
  implements ICommandHandler<DeleteUserCommand, User>
{
  constructor(protected readonly prisma: PrismaService) {}

  async execute(command: DeleteUserCommand): Promise<{
    id: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
  }> {
    const { id } = command;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
      include: {
        user_profile: true,
      },
    });
  }
}
