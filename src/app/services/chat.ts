import { OpenAIChatResponse } from '@/types/OpenAI';
import { arrayFallback } from '../utils/general';

export const requestOpenAIResponse = async (
  prompt: string
) => {
  if (!prompt || prompt.length < 10) {
    throw `Invalid prompt provided: '${prompt}'`;
  }

  const resp = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
        'OpenAI-Organization':
          process.env.NEXT_PUBLIC_OPEN_API_ORG_ID || '',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    }
  );

  const response = await resp.json();
  const choices = arrayFallback(
    ((response || {}) as OpenAIChatResponse).choices
  );

  return (
    choices.length > 0
      ? choices[0]
      : ({} as OpenAIChatResponse['choices'][number])
  )?.message?.content;
};

export const requestOpenAIModels = async () => {
  const resp = await fetch(
    'https://api.openai.com/v1/models',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
        'OpenAI-Organization':
          process.env.NEXT_PUBLIC_OPEN_API_ORG_ID || '',
      },
    }
  );

  const response = await resp.json();

  return response;
};
