import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserCommand } from '../create-user.command';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private prisma: PrismaService) {}

  async execute(command: CreateUserCommand) {
    const existEmail = await this.prisma.user.findFirst({
      where: { email: command.createUserDto.email },
    });
    if (existEmail) throw new ConflictException('Email already registered.');

    const { createUserDto } = command;
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        user_profile: {
          create: {
            name: createUserDto.name,
            avatar_url: createUserDto.avatarUrl,
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
      },
      include: {
        user_profile: true,
      },
    });
  }
}
