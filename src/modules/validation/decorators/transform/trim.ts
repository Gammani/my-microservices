import { Transform, TransformFnParams } from 'class-transformer';

// Custom decorator (в библиотеке class-transformer по умолчанию нету декоратора trim)
// не забываем установить transform: true в глобальном ValidationPipe
export const Trim = () =>
  Transform(({ value }: TransformFnParams): string | undefined => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
