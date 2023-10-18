const Audio = require('./audio.model');

/**
 * Load Audio and append to req.
 */
 function load(req, res, next, id) {
  Audio.get(id)
    .then((audio) => {
      req.audio = audio; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Audio
 * @returns {audio}
 */
function get(req, res) {
  return res.json(req.audio);
}

/**
 * Create new Audio
 * @property {string} req.body.file_name - The file_name of the audio
 * @returns {Audio}
 */
function create(req, res, next) {
  const audio = new Audio({
    file_name: req.body.file_name,
    url:req.body.url,
  });

  audio.save()
    .then(savedAudio => res.json(savedAudio))
    .catch(e => next(e));
}

/**
 * Get audio list.
 * @property {number} req.query.skip - Number of audios to be skipped.
 * @property {number} req.query.limit - Limit number of audios to be returned.
 * @returns {Audio[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Audio.list({ limit, skip })
    .then(audio => res.json(audio))
    .catch(e => next(e));
}


module.exports = { load, get, create, list };
