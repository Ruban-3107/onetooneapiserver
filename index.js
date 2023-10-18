const mongoose = require('mongoose');
const util = require('util');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;
console.log(`mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/`)

// connect to mongo db
let mongoUri;
if (config.env === "production" || "development") {
  // mongoUri = "mongodb://admin:password@127.0.0.1:25499/?authSource=admin"
  mongoUri = `mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`;
  console.log("mongoDB URI ::::condition" + mongoUri);
  //mongoUri = config.mongo.host;
} else {
  mongoUri = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`
}
// console.log(mongoUri);
mongoose.connection.on('connected', () => {
  console.log("Successful connected")
});
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', (error) => {
  console.log("errorttttt::",error)
  throw new Error(`unable to connect to database: ${mongoUri}` ,`${error}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

module.exports = app;
