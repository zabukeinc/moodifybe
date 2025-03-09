import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MoodEntry } from '@prisma/client';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { GroqModelEnum } from './enums/ai.enum';
import { MessageMapper } from './mappers/message.mapper';
import { MoodAnalysis } from './interfaces/ai-analysis.interface';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly groq: Groq;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly messageMapper: MessageMapper,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('ai.groqApiKey'),
    });
  }

  async analyzeMoodEntriesWithGroq(
    entries: MoodEntry[],
    userId: string,
  ): Promise<MoodAnalysis> {
    try {
      const response = await this.groq.chat.completions.create({
        model: GroqModelEnum['llama-3.3-70b-versatile'],
        temperature: this.configService.get<number>('ai.groqTemperature'),
        max_tokens: this.configService.get<number>('ai.groqMaxTokens'),
        user: userId,
        messages: this.messageMapper.mapJsonMessages(entries) as any,
      });

      const content = response.choices[0].message.content;
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      try {
        return JSON.parse(cleanContent) as MoodAnalysis;
      } catch (parseError) {
        this.logger.error(`JSON parsing error: ${parseError.message}`);
        throw new Error('Failed to parse AI response into JSON format');
      }
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
        messages: this.messageMapper.mapNaturalMessages(entries) as any,
        max_tokens: this.configService.get<number>('ai.maxTokens'),
        user: userId,
      });

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Error analyzing mood entries: ${error.message}`);
      throw error;
    }
  }
}
