import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MoodEntry } from '@prisma/client';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam as OpenAIChatCompletionParam } from 'openai/resources';
import { ChatCompletionMessageParam as GroqChatCompletionParam } from 'groq-sdk/resources/chat/completions';
import { GroqModelEnum } from './enums/ai.enum';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly groq: Groq;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    // this.openai = new OpenAI({
    //   apiKey: this.configService.get<string>('ai.openAiApiKey'),
    // });
    this.groq = new Groq({
      apiKey: this.configService.get<string>('ai.groqApiKey'),
    });
  }

  async analyzeMoodEntriesWithGroq(
    entries: MoodEntry[],
    userId: string,
  ): Promise<string> {
    try {
      const response = await this.groq.chat.completions.create({
        // model: this.configService.get<string>('ai.groqModel'),
        model: GroqModelEnum['llama-3.3-70b-versatile'],
        temperature: this.configService.get<number>('ai.groqTemperature'),
        max_tokens: this.configService.get<number>('ai.groqMaxTokens'),
        user: userId,
        messages: this.mapMessages(entries) as GroqChatCompletionParam[],
      });

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error(
        `Error analyzing mood entries with Groq: ${error.message}`,
      );
      throw error;
    }
  }

  async analyzeMoodEntries(
    entries: MoodEntry[],
    userId: string,
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('ai.model'),
        messages: this.mapMessages(entries) as OpenAIChatCompletionParam[],
        max_tokens: this.configService.get<number>('ai.maxTokens'),
        user: userId,
      });

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Error analyzing mood entries: ${error.message}`);
      throw error;
    }
  }

  mapMessagesV2(
    entries: MoodEntry[],
  ): OpenAIChatCompletionParam[] | GroqChatCompletionParam[] {
    const params: OpenAIChatCompletionParam[] | GroqChatCompletionParam[] = [
      {
        role: 'system',
        content: `You are a mood analysis assistant. Analyze the mood entries and provide a JSON response in this exact format:

{
  "overallMoodTrend": {
    "summary": "Brief summary of general mood pattern",
    "highPoints": ["List of significant high moments"],
    "lowPoints": ["List of significant low moments"]
  },
  "patternsAndTriggers": {
    "recurringThemes": ["List of themes"],
    "moodTriggers": ["List of triggers"],
    "correlations": ["List of notable correlations"]
  },
  "insights": {
    "keyObservations": ["List of key observations"],
    "moodActivityRelationships": ["List of relationships between activities and moods"]
  },
  "suggestions": ["2-3 actionable recommendations"]
}

Keep the analysis personal and empathetic while maintaining the exact JSON structure.`,
      },
      {
        role: 'user',
        content: 'Here are the mood entries to analyze:',
      },
    ];

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

  mapMessages(
    entries: MoodEntry[],
  ): OpenAIChatCompletionParam[] | GroqChatCompletionParam[] {
    const params: OpenAIChatCompletionParam[] | GroqChatCompletionParam[] = [
      {
        role: 'system',
        content:
          'You are an AI designed to analyze a user’s mood entries and generate a summary that feels personal, natural, and emotionally engaging. The user may mix languages, use slang, or express emotions informally like the user input for the format (mirror the text-style), also add emoticons if it`s needed for the empathy or sympathy sake. Your job is to generate a friendly and relatable response while recognizing mood patterns. Also give the user insight based on the data provided.',
      },
    ];

    const bucket = {
      1: 'Mood Score - Very Bad',
      2: 'Mood Score - Bad',
      3: 'Mood Score - Neutral',
      4: 'Mood Score - Happy',
      5: 'Mood Score - Very Happy',
    };

    entries.forEach((each) => {
      const prefix = bucket[each.mood_score];

      let message = `${prefix}. `;

      if (each.note && each.note.trim() != '') {
        message += each.note.trim();
      }

      params.push({ content: message, role: 'user' });
    });

    return params;
  }
}
