const getMongoDBID = require("./mongoDBUtils");

/** Move it to mongoDBUtils */
const convertArrToMongoObj = (arr) =>{
    return arr.map(val => getMongoDBID(val));
}

module.exports = convertArrToMongoObj;
