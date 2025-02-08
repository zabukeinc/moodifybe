import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMoodEntryDto {
  @ApiProperty({ example: 5, description: 'Mood score (1-10)' })
  @IsInt()
  @Min(1)
  @Max(10)
  moodScore: number;

  @ApiProperty({ example: 'Feeling great today!' })
  @IsString()
  @IsNotEmpty()
  note: string;

  @ApiProperty({ example: ['happy', 'productive'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
