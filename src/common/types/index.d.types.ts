export type TokenPayloadType = {
  userId: string;
  iat?: number;
  exp?: number;
};

export type UserViewModel = {};

export type UserCreateModelType = {
  login: string;
  email: string;
  age: number;
  description: string;
  created_at: Date;
  passwordHash: string;
};

export interface RequestWithUserId extends Request {
  userId: string;
  cookies?: string;
}

export interface RequestWithUser extends Request {
  user: string;
}
export type TokensType = {
  accessToken: string;
  refreshToken: string;
};
