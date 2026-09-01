export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};