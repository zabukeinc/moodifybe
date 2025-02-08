import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMoodEntryDto } from './dto/create-mood-entry.dto';
import { UpdateMoodEntryDto } from './dto/update-mood-entry.dto';
import { BaseResponse } from '@common/dto/base-response.dto';
import { PaginationResponseDto } from '@common/dto/pagination-response.dto';
import { CreateMoodEntryCommand } from './commands/create-mood-entry.command';
import { UpdateMoodEntryCommand } from './commands/update-mood-entry.command';
import { DeleteMoodEntryCommand } from './commands/delete-mood-entry.command';
import { GetMoodEntriesQuery } from './queries/get-mood-entries.query';
import { GetMoodEntryQuery } from './queries/get-mood-entry.query';
import { GetMoodEntriesDto } from './dto/get-mood-entries.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@app/common/decorators/user.decorator';

@ApiTags('mood-entries')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('mood-entries')
export class MoodEntryController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new mood entry' })
  @ApiResponse({ status: 201, description: 'Mood entry successfully created' })
  async create(@Body() createMoodEntryDto: CreateMoodEntryDto) {
    // TODO: Get userId from auth context
    const userId = 'c1fe1760-0029-41f4-b74f-d3b1fbc1c8da';
    const entry = await this.commandBus.execute(
      new CreateMoodEntryCommand(userId, createMoodEntryDto),
    );
    return new BaseResponse(
      HttpStatus.CREATED,
      'Mood entry created successfully',
      entry,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all mood entries with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Return filtered and paginated mood entries list',
    type: PaginationResponseDto,
  })
  async findAll(
    @Query() query: GetMoodEntriesDto,
    @CurrentUser('userId') rawUserId: string,
  ) {
    Object.assign(query, { userId: rawUserId });
    const { page = 1, limit = 10, startDate, endDate, userId } = query;
    const { entries, total } = await this.queryBus.execute(
      new GetMoodEntriesQuery({
        page,
        limit,
        startDate,
        endDate,
        userId,
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return new PaginationResponseDto(entries, {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mood entry by id' })
  @ApiResponse({ status: 200, description: 'Return mood entry by id' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    const entry = await this.queryBus.execute(
      new GetMoodEntryQuery(id, userId),
    );
    return new BaseResponse(
      HttpStatus.OK,
      'Mood entry retrieved successfully',
      entry,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update mood entry' })
  @ApiResponse({ status: 200, description: 'Mood entry successfully updated' })
  async update(
    @Param('id') id: string,
    @Body() updateMoodEntryDto: UpdateMoodEntryDto,
    @CurrentUser('userId') userId: string,
  ) {
    const entry = await this.commandBus.execute(
      new UpdateMoodEntryCommand(id, userId, updateMoodEntryDto),
    );
    return new BaseResponse(
      HttpStatus.OK,
      'Mood entry updated successfully',
      entry,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mood entry' })
  @ApiResponse({ status: 200, description: 'Mood entry successfully deleted' })
  async remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    const entry = await this.commandBus.execute(
      new DeleteMoodEntryCommand(id, userId),
    );
    return new BaseResponse(
      HttpStatus.OK,
      'Mood entry deleted successfully',
      entry,
    );
  }
}
