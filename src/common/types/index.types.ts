export type TokenPayloadType = {
  userId: string;
  iat?: number;
  exp?: number;
};

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

export class PaginatedResponseDto<T> {
  totalCount: number;
  pageCount: number;
  pageSize: number;
  page: number;
  items: T[];

  constructor(totalCount: number, pageSize: number, items: T[], page: number) {
    this.totalCount = totalCount;
    this.pageSize = pageSize;
    this.pageCount = Math.ceil(totalCount / pageSize);
    this.page = page;
    this.items = items;
  }
}
