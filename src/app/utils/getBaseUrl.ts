const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://portfolio-analyzer-tawny.vercel.app';
}

export default getBaseUrl;