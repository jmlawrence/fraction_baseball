import { requestOpenAIResponse } from '@/app/services/chat';
import { useState, useCallback } from 'react';

export default function useChatGPT() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const askAI = useCallback(async (prompt: string) => {
    setIsLoading(true);
    const resp = await requestOpenAIResponse(prompt);
    setResponse(resp);
    setIsLoading(false);
    return resp;
  }, []);

  return {
    isLoading,
    response,
    askAI,
  };
}
