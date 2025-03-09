import { MoodEntry } from '@prisma/client';
import { AIMessageMapper } from '../types/ai.types';
import { MOOD_BUCKET_LABELS, SYSTEM_PROMPTS } from '../constants/ai.constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageMapper {
  mapJsonMessages(entries: MoodEntry[]): AIMessageMapper {
    const params: AIMessageMapper = [
      {
        role: 'system',
        content: SYSTEM_PROMPTS.JSON_ANALYSIS,
      },
      {
        role: 'user',
        content: 'Here are the mood entries to analyze:',
      },
    ];

    return this.appendSortedEntries(params, entries);
  }

  mapNaturalMessages(entries: MoodEntry[]): AIMessageMapper {
    const params: AIMessageMapper = [
      {
        role: 'system',
        content: SYSTEM_PROMPTS.NATURAL_ANALYSIS,
      },
    ];

    entries.forEach((entry) => {
      const prefix = MOOD_BUCKET_LABELS[entry.mood_score];
      let message = `${prefix}. `;

      if (entry.note?.trim()) {
        message += entry.note.trim();
      }

      params.push({ content: message, role: 'user' });
    });

    return params;
  }

  private appendSortedEntries(
    params: AIMessageMapper,
    entries: MoodEntry[],
  ): AIMessageMapper {
    const sortedEntries = [...entries].sort(
      (a, b) => a.created_at.getTime() - b.created_at.getTime(),
    );

    sortedEntries.forEach((entry) => {
      params.push({
        role: 'user',
        content: `Date: ${entry.created_at.toISOString().split('T')[0]}
Score: ${entry.mood_score}/5
Note: ${entry.note}
Tags: ${entry.tags.join(', ')}`,
      });
    });

    params.push({
      role: 'user',
      content:
        'Analyze these entries and respond with the specified JSON format only.',
    });

    return params;
  }
}
