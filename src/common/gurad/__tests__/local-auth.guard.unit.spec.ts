import { LocalAuthGuard } from '../local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with "local" strategy', () => {
    // Проверим прототип, что guard действительно унаследован от нужного класса
    const guard = new LocalAuthGuard();
    expect(Object.getPrototypeOf(guard).constructor.name).toBe(
      'LocalAuthGuard',
    );
  });
});
