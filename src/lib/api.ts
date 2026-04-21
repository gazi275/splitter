import { PanelNode } from '../types/panel';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'http://localhost:5000/api/v1';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const createHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = token;
  }

  return headers;
};

const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...createHeaders(token),
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  const json = (await response.json()) as ApiResponse<T> & { message?: string };

  if (!response.ok) {
    throw new Error(json?.message || 'Request failed');
  }

  return json.data;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
};

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResult = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyForgotPasswordPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  newPassword: string;
};

export const register = (payload: RegisterPayload) =>
  apiRequest<LoginResult>(
    '/users/register',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

export const verifyOtp = (payload: VerifyOtpPayload) =>
  apiRequest<LoginResult>(
    '/users/verify-otp',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

export const logout = (token: string) =>
  apiRequest<null>(
    '/auth/logout',
    { method: 'POST' },
    token
  );

export const login = (payload: LoginPayload) =>
  apiRequest<LoginResult>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

export const getMyProfile = (token: string) =>
  apiRequest<UserProfile>('/auth/profile', { method: 'GET' }, token);

export const getMyLayout = (token: string) =>
  apiRequest<PanelNode | null>('/panel-layout/me', { method: 'GET' }, token);

export const saveMyLayout = (token: string, layout: PanelNode) =>
  apiRequest<PanelNode>(
    '/panel-layout/me',
    {
      method: 'PUT',
      body: JSON.stringify({ layout }),
    },
    token
  );

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  apiRequest<null>(
    '/auth/forgot-password',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

export const verifyForgotPassword = (payload: VerifyForgotPasswordPayload) =>
  apiRequest<{ message: string }>(
    '/auth/verify-forgot-password',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiRequest<null>(
    '/auth/reset-password',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
