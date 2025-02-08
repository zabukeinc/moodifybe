import {
  Controller,
  Get,
  Body,
  HttpStatus,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from '@common/dto/base-response.dto';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@app/common/dto/pagination-response.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateUserCommand } from './commands/update-user.command';
import { GetUserQuery } from './queries/get-user.query';
import { GetUsersQuery } from './queries/get-users.query';
import { CurrentUser } from '@app/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
@ApiTags('User Module')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated users list',
    type: PaginationResponseDto,
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const { users, total } = await this.queryBus.execute(
      new GetUsersQuery(page, limit),
    );

    const totalPages = Math.ceil(total / limit);

    return new PaginationResponseDto(users, {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user by current token' })
  @ApiResponse({ status: 200, description: 'Return user by current token' })
  async findOne(@CurrentUser('userId') userId: string) {
    console.log({ userId });
    const user = await this.queryBus.execute(new GetUserQuery(userId));
    return new BaseResponse(HttpStatus.OK, 'User retrieved successfully', user);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  async update(
    @CurrentUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.commandBus.execute(
      new UpdateUserCommand(userId, updateUserDto),
    );
    return new BaseResponse(HttpStatus.OK, 'User updated successfully', user);
  }
}
