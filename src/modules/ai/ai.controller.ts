import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { CurrentUser } from '@common/decorators/user.decorator';
import { PrismaService } from '@prisma/prisma.service';
import { MoodEntry } from '@prisma/client';

@ApiTags('AI Testing')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('analyze')
  @ApiOperation({ summary: '[Testing] Analyze current user mood entries' })
  @ApiResponse({ status: 200, description: 'Analysis generated successfully' })
  async analyzeUserMoods(@CurrentUser('userId') userId: string) {
    // const entries = await this.prisma.moodEntry.findMany({
    //   where: { user_id: userId },
    //   orderBy: { created_at: 'desc' },
    //   take: 10,
    // });

    const mockNotes = [
      'Feeling great today! Had a productive day at work.',
      'Not feeling so good, lots of stress.',
      'Just a normal day, nothing special.',
      'Amazing day with friends!',
      'Feeling down and tired.',
      'Super excited about my progress!',
      'Bit anxious about upcoming deadlines.',
      'Peaceful and calm day.',
      'Frustrated with some challenges.',
      'Really happy with how things are going!',
    ];

    const mockTags = [
      ['work', 'productive'],
      ['stress', 'work'],
      ['daily', 'routine'],
      ['friends', 'social', 'happy'],
      ['tired', 'health'],
      ['progress', 'achievement'],
      ['anxiety', 'work'],
      ['peace', 'relaxation'],
      ['challenges', 'growth'],
      ['happiness', 'success'],
    ];
    // const mockNotes = [
    //   'Hari ini vibe-nya positif banget anjir! Kerjaan cepet kelar, main Dota menang terus, eh dikasih rokok sama bos pula. Auto bahagia sih ini!',
    //   'Stress level: over! Kerjaan berantakan, atasan rese mulu. Capek dah, mau resign aja gue!',
    //   'Hari ini biasa aja sih, kayak nasi uduk pagi. Enak sih, tapi ya gitu-gitu aja, ga ada yang spesial.',
    //   'Baru nongki sama gebetan, seru sih cuma gue salting mulu anjir. Malu bingits dah!',
    //   'Capek banget dah, hidup mah kayak lagu dangdut. Kerja, tidur, repeat. Bosan tapi ya mau gimana lagi?',
    //   'WOI GUA DAPET JACKPOT ANJAY!!! Langsung beli nasi padang porsi double dah! Auto kenyang, auto seneng!',
    //   'Deg-degan anjir, ada task numpuk yang deadline mepet banget. Kapan tidurnya nih? Hidup mah emang susah!',
    //   'Santuy bro, hari ini gak ada yang ganggu. Bisa scroll TikTok sambil ngopi enak. Chill abis dah!',
    //   'Ngeselin banget dah, masalah dateng terus kayak cicilan tokopedia. Kapan bisa tenangnya sih?',
    //   'Alhamdulillah, akhirnya semua lancar. Rejeki gak kemana, kerjaan kelar, hati seneng. Syukur mode: on!',
    // ];

    // const mockTags = [
    //   ['kerja', 'lancar', 'Dota', 'rokok', 'bos'],
    //   ['stress', 'kerja', 'atasan', 'capek'],
    //   ['biasa aja', 'nasi uduk', 'hari-hari'],
    //   ['gebetan', 'nongkrong', 'salting', 'malu'],
    //   ['capek', 'hidup', 'bosan'],
    //   ['jackpot', 'nasi padang', 'rejeki'],
    //   ['task', 'deadline', 'deg-degan'],
    //   ['santuy', 'scroll TikTok', 'ngopi'],
    //   ['masalah', 'cicilan', 'ngeselin'],
    //   ['Alhamdulillah', 'lancar', 'rejeki', 'seneng'],
    // ];

    const mock: MoodEntry[] = Array.from({ length: 10 }, (_, index) => ({
      mood_score: Math.floor(Math.random() * 5) + 1,
      note: mockNotes[index],
      tags: mockTags[index],
      created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      id: `mock-${index}`,
      user_id: 'mock-user',
    }));

    const params = this.aiService.mapMessages(mock);
    // const analysis = await this.aiService.analyzeMoodEntries(mock, userId);
    const analysis = await this.aiService.analyzeMoodEntriesWithGroq(
      mock,
      userId,
    );

    return {
      entries: params,
      analysis,
      entriesAnalyzed: mock.length,
    };
  }
}
