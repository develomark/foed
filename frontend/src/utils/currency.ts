export function decimalToFloat(value: string | number) {
  if (value === '') {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}
