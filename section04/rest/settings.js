const options = {
  database: {
    host: 'localhost',
    port: 8000,
    user: 'admin',
    password: 'admin'
  },
  rest: {
    port: 3000,
    whitelist: ['http://localhost:4200']
  }
};

module.exports = {
  options
};