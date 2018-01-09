const restify = require('restify');
const marklogic = require('marklogic');
const corsMiddleware = require('restify-cors-middleware');
const uuid = require('uuid/v4');
const settings = require('./settings');
const fs = require('fs');
const db = marklogic.createDatabaseClient(settings.options.database);
const qb = marklogic.queryBuilder;
const server = restify.createServer();

const cors = corsMiddleware({
  origins: settings.options.rest.whitelist,
});

server.use(restify.plugins.bodyParser({
  mapParams: true,
}));
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

server.get('/api/geospatial', (request, response) => {
  response.charSet('utf-8');
  const radius = ((+request.query.radius * 0.001) * 0.62137119223733);
  const latitude = +request.query.latitude;
  const longitude = +request.query.longitude;
  let query = qb.where(qb.collection('property'), qb.geospatial(qb.geoPropertyPair('location', 'latitude', 'longitude'), qb.circle(radius, latitude, longitude))).withOptions({ queryPlan: true });
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

server.get('/api/search', (request, response) => {
  // garage, garage AND terrace, garage OR garden -balcony
  let searchTerm;
  if (request.query.term) {
    searchTerm = request.query.term;
  } else {
    response.send(400, { message: 'Search term query parameter is required. '});
    return;
  }
  response.charSet('utf-8');
  let query = qb.where(qb.collection('property'), qb.parsedFrom(searchTerm)).withOptions({ queryPlan: true });
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

server.get('/(^\/$)|(\.(jpg)$)', (request, response) => {
  const data = [];
  db.documents.read(request.url).stream('chunked')
  .on('data', chunk => data.push(chunk))
  .on('error', error => console.error(error))
  .on('end', () => {
    let buffer = new Buffer(data.length).fill(0);
    buffer = Buffer.concat(data);
    response.writeHead(200, { 'Content-type': 'image/jpeg' });
    response.end(buffer);
  });
});

server.post('/api/property', (request, response) => {
  const imageURIs = [];
  for(let key in request.files) {
    if (request.files.hasOwnProperty(key)) {
      const imageURI = `/house-${uuid()}.jpg`;
      imageURIs.push(imageURI);
      fs.renameSync(request.files[key].path, `${__dirname}/uploads${imageURI}`);
    }
  }

  const promises = imageURIs.map(imageURI => {
    const content = fs.readFileSync(`./uploads/${imageURI}`);
    const writeStream = db.documents.createWriteStream({
      uri: imageURI,
      contentType: 'image/jpeg',
      collections: ['property-image']
    });
    writeStream.write(content);
    writeStream.end();
    return writeStream.result();
  });

  Promise.all(promises).then(response => {
    response.map(r => fs.unlinkSync(`${__dirname}/uploads/${r.documents[0].uri}`));
  });

  const updatedimageURIs = imageURIs.map(imageURI => imageURI.substr(1));
  // generate URI, check existence URI, insert the document
  const uri = `/property/${uuid()}.json`;
  const data = request.body;
  data.photos = updatedimageURIs;
  const content = {
    property: data
  };
  db.documents.probe(uri).result().then(response => {
    if (response.exists) {
      console.error(`${uri} already exists.`);
    } else {
      return db.documents.write({
        uri,
        content,
        collections: ['property']
      }).result();
    }
  }).then(writeResponse => {
    console.log(writeResponse);
    response.send(201, { success: true });
  });
});

server.listen(settings.options.rest.port, () => console.log(`Server is up on ${settings.options.rest.port}.`));
