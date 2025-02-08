import { UpdateMoodEntryDto } from '../dto/update-mood-entry.dto';

export class UpdateMoodEntryCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly updateMoodEntryDto: UpdateMoodEntryDto,
  ) {}
}
