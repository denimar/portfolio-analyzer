export const condColor = (value: number) => {
  return value > 0 ? 'text-green-500' : value < 0 ? 'text-red-400' : 'text-gray-600'
}
