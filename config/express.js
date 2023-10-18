const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const httpStatus = require("http-status");
const expressWinston = require("express-winston");
const expressValidation = require("express-validation");
const helmet = require("helmet");
const winstonInstance = require("./winston");
const routes = require("../index.route");
const config = require("./config");
const APIError = require("../server/helpers/APIError");

const app = express();

if (config.env === "development") {
  app.use(logger("dev"));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// app.use(cors({
//   'allowedHeaders': ['Authorization', 'Content-Type'],
//   'exposedHeaders': ['Authorization'],
//   'origin': '*',
//   'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   'preflightContinue': false
// }));

// enable CORS - Cross Origin Resource Sharing
const allowedOrigins = [
  "http://leap-dev.4b63.pro-ap-southeast-2.openshiftapps.com",
  "http://auth-service-dev.4b63.pro-ap-southeast-2.openshiftapps.com",
  "http://localhost",
  "http://localhost:8100",
  "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop",
  "http://leapserverproxy-dev.4b63.pro-ap-southeast-2.openshiftapps.com",
  "https://leap-dev.1to1help.net/",
  "http://leap-app-dev.4b63.pro-ap-southeast-2.openshiftapps.com/",
  "https://leap.1to1help.net/",
  "http://frontendngnix-dev.4b63.pro-ap-southeast-2.openshiftapps.com/",
];

// const allowedOrigins = ["http://leap-dev.4b63.pro-ap-southeast-2.openshiftapps.com", "http://auth-service-dev.4b63.pro-ap-southeast-2.openshiftapps.com", "http://localhost","http://localhost:8100", "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop"];
// app.use(cors({
//   origin: function(origin, callback){
//     console.log('origin',origin);
//     // allow requests with no origin
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       const msg = 'The CORS policy for this site does not ' +
//         'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));


// enable detailed API logging in dev env
if (config.env === "development") {
  expressWinston.requestWhitelist.push("body");
  expressWinston.responseWhitelist.push("body");
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg:
        "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    })
  );
}

// mount all routes on /api path
app.use("/api/v2", routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map((error) => error.messages.join(". "))
      .join(" and ");
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError("API not found", httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
// if (config.env !== "test") {
//   app.use(
//     expressWinston.errorLogger({
//       winstonInstance,
//     })
//   );
// }

// error handler, send stacktrace only during development
app.use((
  err,
  req,
  res,
  next // eslint-disable-line no-unused-vars
) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    //  stack: config.env === 'development' ? err.stack : {} /** Remove it in production . Make it better */
    stack: err.stack ? err.stack.split("\n")[0] : {},
  })
);

module.exports = app;
