export class UpdateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: { age?: number; description?: string },
  ) {}
}
