
export const formatNumber = (number: number, decimals: number = 2): string => {
  try {
    return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (e) {
    return '-';
  }
}