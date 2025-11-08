// src/lib/http-error.ts
type BackendErrorData = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type ErrorLike = { message?: string };

type HttpErrorLike = {
  response?: {
    data?: BackendErrorData;
  };
  message?: string;
};

export const extractErrorMessage = (err: unknown): string => {
  if (typeof err === "object" && err !== null) {
    const http = err as HttpErrorLike;
    const data = http.response?.data;
    if (data) {
      if (data.errors && typeof data.errors === "object") {
        const keys = Object.keys(data.errors);
        if (keys.length > 0) {
          const first = data.errors[keys[0]];
          if (Array.isArray(first) && first.length > 0) return String(first[0]);
          return String(first);
        }
      }
      if (data.message) return data.message;
    }
    if (http.message) return http.message;
  }
  return "Terjadi kesalahan tidak dikenal.";
};