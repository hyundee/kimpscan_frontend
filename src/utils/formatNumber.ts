export const formatInteger = (number?: string) => {
  const num = Number(number);
  return Math.floor(num);
};

export const formatPrice = (price?: string) => {
  const str = String(formatInteger(price));
  if (str.length <= 4) {
    return str.padEnd(4, '0');
  }
  return str?.slice(0, 4);
};

export const formatNumber = (number: number) => {
  // const num = formatInteger(number);
  // const integerNum = Number(num.toFixed(0));
  if (number >= 100000000) {
    return `${Math.floor(number / 100000000)}억`;
  } else if (number >= 10000) {
    return `${Math.floor(number / 10000)}만`;
  }
  return number;
};
