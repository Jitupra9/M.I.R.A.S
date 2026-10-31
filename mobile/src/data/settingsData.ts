import { AIModelConfig } from '../types';

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    badge: 'HYBRID REASONING',
    description: 'Premier agent intelligence for multi-step LangGraph graph routing and tool use.',
    speed: '450ms',
    reasoning: '98/100',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omnimodal',
    provider: 'OpenAI',
    badge: 'MULTIMODAL AUDIO',
    description: 'High-speed audio-to-audio multimodal streaming with native nuance.',
    speed: '280ms',
    reasoning: '95/100',
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google DeepMind',
    badge: 'ULTRA LOW LATENCY',
    description: 'Sub-200ms real-time conversational streaming and long context window.',
    speed: '160ms',
    reasoning: '93/100',
  },
];
