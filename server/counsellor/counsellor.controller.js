const Counsellor = require('./counsellor.model');
const getMongoDBID = require('../helpers/mongoDBUtils');


/**
 * Load Counsellor and append to req.
 */
function load(req, res, next, id) {
  Counsellor.get(id)
    .then((counsellor) => {
    req.counsellor = counsellor; // eslint-disable-line no-param-reassign
  return next();
})
.catch(e => next(e));
}

/**
 * Get Counsellor
 * @returns {counsellor}
 */
function get(req, res) {
  return res.json(req.counsellor);
}

// function counsellorUpdate(req, res) {
//   Counsellor.updateCounsellorSession(req.body.counsellor_id)
//     .then(counsellor => res.json(counsellor))
// .catch(e => next(e));
// }
//
// function counsellorUpdateAvailable(req, res) {
//   Counsellor.updateCounsellorSessionAvailable(req.body.counsellor_id)
//     .then(counsellor => res.json(counsellor))
// .catch(e => next(e));
// }

/**
 * Create new Counsellor
 * @property {object} req.body.counsellor - The counsellor object.
 * @returns {counsellor}
 */
function create(req, res, next) {
  const counsellor = new Counsellor({
    counsellor_name: req.body.counsellor_name,
    counsellor_phone: req.body.counsellor_phone,
    counsellorm_email: req.body.counsellor_emial,
    mode: req.body.mode,
    contexts: req.body.contexts,
    age: req.body.age,
    company_type: req.body.company_type,
    experience: req.body.experience,
    context_profile: req.body.context_profile,
    language: req.body.language,
    gender: req.body.gender,
    role: req.body.role,
    sessions_perday: req.body.sessions_perday,
    sessions_permonth: req.body.sessions_permonth,
    sessions_peryear: req.body.sessions_peryear,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    counsellor_id: req.body.counsellor_id
  });

  counsellor.save()
    .then(savedCounsellor => res.json(savedCounsellor))
    .catch(e => next(e));
}

/**
 * Get Counsellor list.
 * @property {number} req.query.skip - Number of counsellor to be skipped.
 * @property {number} req.query.limit - Limit number of counsellor to be returned.
 * @returns {counsellor[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Feedback.list({ limit, skip })
    .then(counsellor => res.json(counsellor))
.catch(e => next(e));
}

module.exports = { load, get, create, list};
