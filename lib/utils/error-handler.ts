export interface ApiError {
  code: number;
  message: string;
  errors?: Record<string, string[]>;
}

export class ErrorHandler {
  static handle(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred';
  }

  static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }

  static getErrorMessage(error: unknown): string {
    if (this.isApiError(error)) {
      return error.message;
    }
    
    return this.handle(error);
  }
}
