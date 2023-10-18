const FeelingToday = require('./feelingToday.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

/**
 * Create new Feeling Today against a userId

 * @returns {FeelingToday}
 */
function create(req, res, next) {
  const feeling = new FeelingToday({
    userId: getMongoDBID(req.body.userId),
    feeling: req.body.feeling,
    smiley: req.body.smiley,
    created_date: req.body.created_date
  });

  feeling.save()
    .then(savedFeeling => res.json(savedFeeling))
.catch(e => next(e));
}

function createFeelingToday(req, res, next) {
  FeelingToday.createFeelingByUser(req.body, req.params.userId)
    .then((feeling) => {
    return res.json(feeling);
  })
  .catch(e => next(e));
}

function getFeelingByUserId(req, res, next) {
  const userId = req.params.userId;
  FeelingToday.getFeelingByUserId(userId)
    .then(userDetails => res.json(userDetails))
.catch(e => next(e));
}

module.exports = {create, createFeelingToday, getFeelingByUserId};
