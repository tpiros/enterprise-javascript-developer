const restify = require('restify');
const marklogic = require('marklogic');
const corsMiddleware = require('restify-cors-middleware');
const settings = require('./settings');

const db = marklogic.createDatabaseClient(settings.options.database);
const qb = marklogic.queryBuilder;
const server = restify.createServer();

const cors = corsMiddleware({
  origins: settings.options.rest.whitelist
});

server.use(restify.plugins.bodyParser({ mapParams: false }));
server.use(restify.plugins.queryParser());
server.pre(cors.preflight);
server.use(cors.actual);

// /api/properties -> 1-10 /api/properties?page=8 -> 80-89
server.get('/api/properties', (request, response) => {
  response.charSet('utf-8');
  let query = qb.where(qb.collection('property')).withOptions({ queryPlan: true });
  let page = 0;

  if (request.query.page && +request.query.page > 0) {
    page = +request.query.page;
  }

  db.documents.query(
    query.slice(page === 0 ? 0 : (10 * page))
  )
  .result()
  .then(documents => {
    const data = {};
    const total = +documents[0].total ? +documents[0].total : 0;
    if (total > 0) {
      data.documents = documents.slice(1);
    } else {
      data.documents = [];
    }
    data.total = total;
    response.send(data);
  })
  .catch(error => console.error(error));
});

server.get('/api/properties/:propertyID', (request, response) => {
  response.charSet('utf-8');
  const uri = `/property/${request.params.propertyID}`;
  db.documents.read(uri).result().then(document => response.send(document[0]))
  .catch(error => console.error(error));
});

server.listen(settings.options.rest.port, () => console.log(`Server is up on ${settings.options.rest.port}.`));