import { ChatCompletionMessageParam as OpenAIChatCompletionParam } from 'openai/resources';
import { ChatCompletionMessageParam as GroqChatCompletionParam } from 'groq-sdk/resources/chat/completions';

export type AIChatMessage = OpenAIChatCompletionParam | GroqChatCompletionParam;
export type AIMessageMapper =
  | OpenAIChatCompletionParam[]
  | GroqChatCompletionParam[];
