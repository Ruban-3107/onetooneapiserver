const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Schema = mongoose.Schema;
const idvalidator = require('mongoose-id-validator');

/**
 * Context Mapping Schema
 */
const ContextMappingSchema = new mongoose.Schema({
  contextMongoId: {
    type: Schema.Types.ObjectId,
    ref: "master_context"
  },
  concernMongoId: {
    type: Schema.Types.ObjectId,
    ref: "master_concern"
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

ContextMappingSchema.plugin(idvalidator);

/**
 * Methods
 */
ContextMappingSchema.method({
});

/**
 * Statics
 */
ContextMappingSchema.statics = {

};

/**
 * @typedef Context Mapping
 */
module.exports = mongoose.model('mapping_concern_context', ContextMappingSchema);
