import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { User } from '@prisma/client';
import { PrismaService } from '@app/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, User>
{
  constructor(protected readonly prisma: PrismaService) {}

  async execute(command: UpdateUserCommand): Promise<{
    id: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
  }> {
    const { id, updateUserDto } = command;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateData: any = {
      updated_at: new Date(),
    };

    if (updateUserDto.email) {
      updateData.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        user_profile:
          updateUserDto.name || updateUserDto.avatarUrl
            ? {
                update: {
                  name: updateUserDto.name,
                  avatar_url: updateUserDto.avatarUrl,
                  updated_at: new Date(),
                },
              }
            : undefined,
      },
      include: {
        user_profile: true,
      },
    });
  }
}
