export class DeleteMoodEntryCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
