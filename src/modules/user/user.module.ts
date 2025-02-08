import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './user.controller';
import { PrismaModule } from '@prisma/prisma.module';
import { GetUsersHandler } from './queries/handlers/get-users.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
const QueryHandlers = [GetUsersHandler, GetUserHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [UserController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class UserModule {}
