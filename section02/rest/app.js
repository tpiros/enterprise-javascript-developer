const restify = require('restify');
const data = require('./data');

const port = 3000;
const server = restify.createServer();

server.use(restify.plugins.bodyParser({ mapParams: false }));

server.get('/api/properties', (request, response) => {
  response.charSet('utf-8');
  response.json(200, data.properties);
});

server.get('/api/properties/:id', (request, response) => {
  const propertyID = +request.params.id;
  const property = data.properties.filter(prop => prop.property.id === propertyID);
  response.charSet('utf-8');
  response.json(200, property);
});

server.post('/api/properties', (request, response) => {
  const title = request.body.title;
  const price = request.body.price;
  const newProperty = { title, price };
  data.properties.push(newProperty);
  response.json(201, data.properties);
});

server.listen(port, () => console.log(`Server is up on ${port}.`));