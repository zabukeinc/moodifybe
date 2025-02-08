import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateMoodEntryDto {
  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  moodScore?: number;

  @ApiPropertyOptional({ example: 'Feeling great today!' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: ['happy', 'productive'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
