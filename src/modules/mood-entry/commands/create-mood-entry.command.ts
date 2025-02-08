import { CreateMoodEntryDto } from '../dto/create-mood-entry.dto';

export class CreateMoodEntryCommand {
  constructor(
    public readonly userId: string,
    public readonly createMoodEntryDto: CreateMoodEntryDto,
  ) {}
}
