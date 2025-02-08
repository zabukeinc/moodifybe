import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  openAiApiKey: process.env.OPENAI_API_KEY,
  openAimodel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  openAimaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 500,
  openAiTemperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,

  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
  groqMaxTokens: parseInt(process.env.GROQ_MAX_TOKEN, 10) || 1000,
  groqTemperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7,
}));
