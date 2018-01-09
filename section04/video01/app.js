const marklogic = require('marklogic');
const db = marklogic.createDatabaseClient({
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin'
});
const qb = marklogic.queryBuilder;

db.documents.query(
  qb.where(
    qb.geospatial(
      qb.geoPropertyPair('location', 'latitude', 'longitude'),
      qb.circle(5, 51.5034, -0.1276) // 10 Downing Street
    ),
    qb.collection('property')
  )
).result().then(response => {
  const addresses = response.map(r => r.content.property.location.address)
  console.log(addresses);
});