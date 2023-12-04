exports.appConfig = {
  CLIENT_URL:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : 'http://localhost:3001',
  SERVER_URL:
    process.env.NODE_ENV === 'production'
      ? process.env.SERVER_URL
      : 'http://localhost:3000',
};
