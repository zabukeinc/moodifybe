export class GetMoodEntriesQuery {
  constructor(
    public readonly filters: {
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      page: number;
      limit: number;
    },
  ) {}
}
