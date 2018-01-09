const Hapi = require('hapi');
const data = require('./data');
const server = Hapi.Server({ port: 3000, host: 'localhost' });

function showTimestamp() {
  console.log(`Request time: ${(new Date).toLocaleString()}`);
  return `Request time: ${(new Date).toLocaleString()}`;
}

async function startServer() {
  try {
    await server.start();
    console.log(`Started ${server.info.host}:${server.info.port}`);
    server.route([
      { method: 'GET', path: '/', options: { pre: [{ method: showTimestamp }] }, handler: (request, h) => h.response(data.property).code(200) },
      { method: 'POST', path: '/', handler: () => 'POST example' }
    ]);
  } catch(error) {
    console.log(error);
  }
}

startServer();