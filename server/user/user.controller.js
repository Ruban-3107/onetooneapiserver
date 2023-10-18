const _user = require('./user.model');
const mongoose = require('mongoose');
const getMongoDBID = require('../helpers/mongoDBUtils');
const request = require("request");
// const Template = require('../template/template.model');
const Config = require('../../config/config');
const Account = require("../account/account.model");
const getuuid = require('../helpers/Utils');

function dateFormat(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  let finalDate = day + "-" + month + "-" + year;
  return finalDate;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  _user.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function create(req, res, next) {
  try{
    const user = new _user({
      account_id: getMongoDBID(req.body.account_id),
      age: req.body.age,
      gender: req.body.gender,
      relationship_status: req.body.relationship_status,
      birthdate: req.body.birthdate,
      session: req.body.session||{},
      current_distress: req.body.current_distress || 0 ,
      key_areas: req.body.key_areas||[],
      profile_img:req.body.profile_img||'',
      notification:req.body.notification,
      location : req.body.location,
      appId: req.body.appId||[],
      uuid: getuuid(),
      cmsData: req.body.cmsdata ? req.body.cmsdata : false
    });

    user.save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));

  }catch(error){
    next(error)
  }
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  _user.updateUser(req.body, req.params.accountId)
    .then(users => res.json(users))
.catch(e => next(e));
}

function updateUserCms(req, res, next) {
  _user.updateUserById(req.body, req.body.uuid)
    .then(users => res.json(users))
    .catch(e => next(e));
}

function updateAccount(req,res,next){
  Account.updateAccount(req.body)
    .then(userDetails => res.json(userDetails))
.catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  _user.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

function userDistressDetails(req, res, next) {
  const userId = req.params.userId;
  _user.getDistress(userId)
    .then(userDetails => res.json(userDetails))
  .catch(e => next(e));
}

function userDistressUpdate(id, body) {
  const userId = id;
  _user.updateUserDistress(userId, body)
    .then(userDetails => console.log(userDetails))
  .catch(e => console.log(e));
}

function updateUserDetails(req, res, next){
  const userId = req.params.userId;
  _user.updateUserDistress(userId, req.body)
  .then(userDetails => res.json(userDetails))
  .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove, userDistressDetails, userDistressUpdate, updateUserDetails,updateUserCms,updateAccount};
