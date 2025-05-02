export class GetUsersQuery {
  constructor(
    public readonly searchLoginTerm?: string,
    public readonly sortDirection: 'asc' | 'desc' = 'asc',
    public readonly pageNumber: number = 1,
    public readonly pageSize: number = 10,
  ) {}
}
