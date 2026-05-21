import axios from 'axios';

import type { ErrorResponse } from '@/types/api';

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return fallback;
  }

  const response = error.response?.data;
  if (!response) {
    return fallback;
  }

  const validationMessages = Object.values(response.validationErrors ?? {}).filter(Boolean);
  if (validationMessages.length > 0) {
    return validationMessages.join(' ');
  }

  return response.message || fallback;
}
