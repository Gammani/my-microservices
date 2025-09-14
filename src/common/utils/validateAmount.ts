export function parseAndCheckAmount(raw: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
    throw new Error(
      'Сумма должна быть положительным числом с не более чем двумя знаками после запятой',
    );
  }
  const parsed = parseFloat(raw);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('Сумма должна быть больше нуля');
  }
  return parsed;
}
