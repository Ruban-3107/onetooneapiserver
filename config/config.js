const Joi = require("joi");

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require("dotenv").config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  MONGODB_SERVICE_HOST: Joi.string().required().description("Mongo host url"),
  MONGODB_SERVICE_PORT: Joi.number().default(27017),
  MONGODB_DATABASE: Joi.string().required().description("Mongo DB name"),
  MONGODB_USER: Joi.string().when("NODE_ENV", {
    is: Joi.string().equal("production"),
    then: Joi.string().required().description("Mongo user name"),
    otherwise: Joi.string().default(""),
  }),
  MONGODB_PASSWORD: Joi.string().when("NODE_ENV", {
    is: Joi.string().equal("production"),
    then: Joi.string().required().description("Mongo user name"),
    otherwise: Joi.string().default(""),
  }),
  SALTINGROUNDS: Joi.number().default(10),
  NOTIFICATION_URL: Joi.string().required().description("notification url"),
  SENDGRID_API_KEY: Joi.string().required().description("email sendgrid key"),
  CMS_API_KEY: Joi.string().description("cms api key"),
  CMS_URL: Joi.string().description("CMS URL"),
  MESSAGE_QUEUE: Joi.string().required().description("MESSAGE_QUEUE"),
  NGNIX_PROXY: Joi.string().required().description("NGNIX_PROXY"),
  MEETING_URL: Joi.string().required().description("MEETING_URL"),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  sendgridApiKey: envVars.SENDGRID_API_KEY,
  saltingRounds: envVars.SALTINGROUNDS,
  notification_url: envVars.NOTIFICATION_URL,
  cms_api_key: envVars.CMS_API_KEY,
  cms_url: envVars.CMS_URL,
  message_queue: envVars.MESSAGE_QUEUE,
  ngnix_proxy: envVars.NGNIX_PROXY,
  meeting_url: envVars.MEETING_URL,
  mongo: {
    host: envVars.MONGODB_SERVICE_HOST,
    port: envVars.MONGODB_SERVICE_PORT,
    db: envVars.MONGODB_DATABASE,
    username: envVars.MONGODB_USER,
    password: envVars.MONGODB_PASSWORD,
  },
};

module.exports = config;
