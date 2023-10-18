
const MyDiary = require('./myDiary.model');
const getMongoDBID = require('../helpers/mongoDBUtils');

/**
 * Load myDiary and append to req.
 */
function load(req, res, next, id) {
  MyDiary.get(id)
    .then((myDiary) => {
    req.myDiary = myDiary; // eslint-disable-line no-param-reassign
  return next();
})
.catch(e => next(e));
}

/**
 * Get myDiary details
 * @returns {myDiary}
 */
function get(req, res) {
  return res.json(req.myDiary);
}

/**
 * Create new myDiary details
 * @property {string} req.body.rating - mydiary rating.
 * @property {object} req.body.details - myDiary details.
 * @returns {mydiary}
 */
function create(req, res, next) {
  const myDiary = new MyDiary({
    rating: req.body.rating,
    details: req.body.details,
    images: req.body.images,
    audio: req.body.audio,
    file: req.body.file,
    tags: req.body.tags,
    status:req.body.status,
    user_id:req.body.user_id
  });
  myDiary.save()
    .then(savedData => res.json(savedData))
.catch(e => next(e));
}

/**
 update myDiary
 */
function deleteMydiary(req, res, next) {
  MyDiary.updateMyDiary(req.body, req.params)
    .then((myDiary) => { res.json( myDiary )}).catch((e) => next(e));

}
// function update(req, res, next){
//   MyDiary.updateMyDiary(req.body, req.params)
//     .then((myDiary) => { res.json( myDiary )}).catch((e) => next(e));
// }

/**
 * Get setting list.
 */
function list(req, res, next) {
  MyDiary.list()
    .then(accounts => res.json(accounts))
.catch(e => next(e));
}

module.exports = { load, get, create, list,deleteMydiary};
